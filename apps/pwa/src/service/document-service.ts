import {
  DocumentCreateMessage, DocumentCreateResponseMessage,
  DocumentDeleteMessage, DocumentDeleteResponseMessage,
  DocumentListMessage, DocumentListResponseMessage,
  DocumentUpdateMessage,
  DocumentUpdateResponseMessage
} from '@hai/core-service';
import { assertApiSuccess, buildMessage } from '@hai/service-web';
import { sendAndAwaitServiceWorker } from './app-service';

export class DocumentService {
  async createDocument(content: string) {
    const req: DocumentCreateMessage = buildMessage('Document.Create', {
        payload: {
          content
        }
      }
    );
    await sendAndAwaitServiceWorker<
      DocumentCreateMessage,
      DocumentCreateResponseMessage
    >(req);
  }

  async deleteDocument(id: string) {
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

  async getDocuments(): Promise<Array<{ id: string, content: string }>> {
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

  async updateDocument(id: string, content: string): Promise<DocumentUpdateResponseMessage> {
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