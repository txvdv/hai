export class DocumentService {
  // Message the service worker and wait for the response
  static async getDocuments(): Promise<Array<string>> {
    if (!navigator.serviceWorker.controller) {
      throw new Error('Service Worker controller not found');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        console.log('Message received from service worker', event);
        if (event.data && event.data.type === 'DOCUMENTS_RESPONSE') {
          resolve(event.data.documents);
        } else {
          reject(new Error('Unexpected message received'));
        }
      };

      navigator.serviceWorker?.controller?.postMessage(
        { type: 'GET_DOCUMENTS' },
        [messageChannel.port2]
      );
    });
  }
}