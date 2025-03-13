import {
  MessageEnvelope,
  MessageResponse,
  ProblemDetails,
} from '@hai/service-web';
import { createUUID } from '@hai/common-utils';

export class Client {
  async sendAndWait<ReqType extends MessageEnvelope, ResType = any>(
    msg: ReqType,
    timeoutInMs = 5000
  ): Promise<ResType> {
    try {
      return await sendAndAwaitServiceWorker<ReqType, ResType>(
        msg,
        timeoutInMs
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }
}

export type SimpleMessageResponse<T> =
  | { status: 'success'; payload: T }
  | { status: 'error'; payload: ProblemDetails };

export function asSimpleResponseMessage<T>(
  response: MessageResponse<T>
): SimpleMessageResponse<T> {
  if (response.status === 'success') {
    return {
      status: 'success',
      payload: response.payload as T, // Explicitly cast payload to type T
    };
  } else {
    return {
      status: 'error',
      payload: response.payload as ProblemDetails, // Explicitly cast payload to ProblemDetails
    };
  }
}

async function sendAndAwaitServiceWorker<
  ReqType extends MessageEnvelope,
  ResType
>(message: ReqType, timeoutInMs = 5000): Promise<ResType> {
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
