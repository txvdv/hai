import { createUUID } from '@hai/common-utils'
import {buildMessage, MessageEnvelope} from '@hai/service-web';
import { PingMessage, PingResponseMessage } from '@hai/service-web';

export class AppService {
  async pingPong(message: string) {
    const req: PingMessage = buildMessage('App.Ping', {
        payload: message
      }
    );
    return await sendAndAwaitServiceWorker<
      PingMessage,
      PingResponseMessage
    >(req);
  }
}

export async function sendAndAwaitServiceWorker<ReqType extends MessageEnvelope, ResType>(
  message: ReqType,
  timeoutInMs = 5000
): Promise<ResType> {
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
      timestamp: new Date().toISOString()
    }
  };

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`No response received for correlationId ${correlationId} within ${timeoutInMs}ms`));
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

export async function waitForServiceWorkerController(timeoutInMs = 10000): Promise<ServiceWorker> {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator)) {
      reject(new Error('Service workers are not supported.'));
      return;
    }

    if (navigator.serviceWorker.controller) {
      // Service worker controller is already available
      resolve(navigator.serviceWorker.controller);
      return;
    }

    // Prepare a timeout to avoid indefinite waiting
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`Timeout of ${timeoutInMs}ms waiting for service worker controller.`));
    }, timeoutInMs);

    // Listener for the 'controllerchange' event
    function onControllerChange() {
      if (navigator.serviceWorker.controller) {
        cleanup();
        resolve(navigator.serviceWorker.controller);
      }
    }

    // Cleanup function to remove event listeners and clear timeout
    function cleanup() {
      clearTimeout(timeoutId);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    }

    // Add the listener for 'controllerchange'
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    // Handle service worker readiness errors or rejections
    navigator.serviceWorker.ready
      .then(() => {})
      .catch((err) => {
        cleanup();
        reject(err);
      });
  });
}

// Example service worker.js
// self.addEventListener('message', (event) => {
//   console.log('Service worker received message:', event.data);
// });

// // TODO: WORKS, but disabled until a good usecase is found
// navigator.serviceWorker.ready.then((registration) => {
//   const messageChannel = new MessageChannel();
//
//   // Listen for messages from the service worker
//   messageChannel.port1.onmessage = (event) => {
//     const { type, payload } = event.data || {};
//     if (type === "Notification") {
//       console.log(`Notification received: ${payload.message}`);
//     } else if (type === "NotificationChannelReady") {
//       console.log(`Notification channel ready for client ID: ${payload.clientId}`);
//     }
//   };
//
//   // Register the notification channel
//   const clientId = "unique-client-id-123";
//   registration.active?.postMessage(
//     { type: "SetupNotificationChannel", clientId },
//     [messageChannel.port2]
//   );
//
//   // Send periodic KeepAlive messages
//   setInterval(() => {
//     registration.active?.postMessage({
//       type: "KeepAlive",
//       clientId,
//     });
//   }, 10000); // Every 10 seconds
// });
