import {
  ApiResponse,
  buildMessage, DocumentDeleteMessage, DocumentUpdateMessage, DocumentUpdateResponseMessage, MessageEnvelope
} from '../message-interface';

export class DocumentService {
  static async getDocuments(): Promise<Array<{ id: string, content: string }>> {
    if (!navigator.serviceWorker.controller) {
      throw new Error('Service Worker controller not found');
    }

    const message = buildMessage('Document.List');

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        console.log('Message received from service worker', event);
        const resMsg = event.data;
        if (resMsg && resMsg.type === 'Document.List.Response') {
          resolve(event.data.payload.documents);
        } else {
          reject(new Error('Unexpected message received'));
        }
      };

      navigator.serviceWorker?.controller?.postMessage(
        message,
        [messageChannel.port2]
      );
    });
  }

  static async createDocument(): Promise<Array<string>> {
    if (!navigator.serviceWorker.controller) {
      throw new Error('Service Worker controller not found');
    }

    const message = buildMessage('Document.Create', {
        payload: {
          content: 'Hello World'
        }
      }
    );

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        const resMsg = event.data;
        console.log('Message received from service worker', event);
        if (resMsg && resMsg.type === 'Document.Create.Response') {
          resolve(resMsg.payload);
        } else {
          reject(new Error('Unexpected message received'));
        }
      };

      navigator.serviceWorker?.controller?.postMessage(
        message,
        [messageChannel.port2]
      );
    });
  }

  static async updateDocument(id: string, content: string): Promise<ApiResponse<DocumentUpdateResponseMessage>> {
    const req: DocumentUpdateMessage = buildMessage('Document.Update', {
        payload: {
          id,
          content
        }
      }
    );

    return await sendAndAwaitServiceWorker<
      DocumentUpdateMessage,
      DocumentUpdateResponseMessage
    >(req);
  }

  static async deleteDocument(id: string) {
    const req: DocumentDeleteMessage = buildMessage('Document.Delete', {
        payload: {
          id
        }
      }
    );

    const res = await sendAndAwaitServiceWorker(req);
    console.log('Response from service worker', res);
  }
}

async function sendAndAwaitServiceWorker<ReqType extends MessageEnvelope, ResType>(
  message: ReqType,
  timeoutInMs = 5000
): Promise<ApiResponse<ResType>> {
  if (!navigator.serviceWorker.controller) {
    // TODO: better format for UI response
    // build a Problem Details and issue a popup
    throw new Error('Service worker controller not available.');
  }

  const correlationId = generateUniqueId();
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

// Utility function: Create a unique correlationId
function generateUniqueId() {
  return [...Array(9)].map(() => Math.random().toString(36)[2]).join('');
}

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
