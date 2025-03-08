import {
  assertApiSuccess,
  buildMessage, DocumentCreateMessage, DocumentCreateResponseMessage,
  DocumentDeleteMessage, DocumentDeleteResponseMessage,
  DocumentListMessage, DocumentListResponseMessage,
  DocumentUpdateMessage,
  DocumentUpdateResponseMessage,
  MessageEnvelope
} from '../message-interface';

export class DocumentService {
  static async createDocument() {
    const req: DocumentCreateMessage = buildMessage('Document.Create', {
        payload: {
          content: 'Hello World'
        }
      }
    );
    await sendAndAwaitServiceWorker<
      DocumentCreateMessage,
      DocumentCreateResponseMessage
    >(req);
  }

  static async deleteDocument(id: string) {
    const req: DocumentDeleteMessage = buildMessage('Document.Delete', {
        payload: {
          id
        }
      }
    );

    await sendAndAwaitServiceWorker<
      DocumentDeleteMessage,
      DocumentDeleteResponseMessage
    >(req);
  }

  static async getDocuments(): Promise<Array<{ id: string, content: string }>> {
    const req: DocumentListMessage = buildMessage('Document.List');
    const res = await sendAndAwaitServiceWorker<
      DocumentListMessage,
      DocumentListResponseMessage
    >(req);

    if (assertApiSuccess(res)) {
      console.log(res.payload.documents);
      return res.payload.documents;
    } else {
      console.log(res.payload.errors);
      throw new Error('Error');
    }
  }

  static async updateDocument(id: string, content: string): Promise<DocumentUpdateResponseMessage> {
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
}

async function sendAndAwaitServiceWorker<ReqType extends MessageEnvelope, ResType>(
  message: ReqType,
  timeoutInMs = 5000
): Promise<ResType> {
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
