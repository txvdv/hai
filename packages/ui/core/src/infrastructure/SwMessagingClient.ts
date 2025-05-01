import { createUUID } from '@hai/common-utils';
import {
  RequestMessageEnvelope,
  ResponseMessageEnvelope,
} from '@hai/service-web';

export class SwMessagingClient {
  async sendAndWait<ReqType = any, ResType = any>(
    path: string,
    type: string,
    payload: ReqType,
    timeoutInMs = 5000
  ): Promise<ResponseMessageEnvelope> {
    try {
      const message = createRequestMessage(path, type, payload);
      return await sendAndAwaitServiceWorker(message, timeoutInMs);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }
}

function createRequestMessage<T>(
  path: string,
  type: string,
  payload: T
): RequestMessageEnvelope<T> {
  return {
    type,
    metadata: {
      correlationId: createUUID(),
      messageId: createUUID(),
      messagePath: path,
      timestamp: new Date().toISOString(),
    },
    payload,
  };
}

async function sendAndAwaitServiceWorker(
  message: RequestMessageEnvelope<any>,
  timeoutInMs = 5000
): Promise<ResponseMessageEnvelope> {
  if (!navigator.serviceWorker.controller) {
    // TODO: better format for UI response
    // build a Problem Details and issue a popup
    throw new Error('Service worker controller not available.');
  }

  const correlationId = createUUID();
  const messageWithCorrelationId = {
    ...message,
    metadata: {
      ...(message.metadata || {}),
      correlationId,
      timestamp: new Date().toISOString(),
    },
  };

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new Error(
          `No response received for correlationId ${correlationId} within ${timeoutInMs}ms`
        )
      );
      navigator.serviceWorker.removeEventListener('message', messageHandler);
    }, timeoutInMs);

    // Listen for messages from the service worker
    function messageHandler(event: MessageEvent<any>) {
      const response = event.data;

      if (response.metadata?.correlationId === correlationId) {
        clearTimeout(timeout);
        resolve(response);
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      }
    }

    navigator.serviceWorker.addEventListener('message', messageHandler);

    // Post the message to the service worker
    navigator!.serviceWorker!.controller!.postMessage(messageWithCorrelationId);
  });
}
