import {
  assertApiSuccess,
  buildMessage,
  DocumentCreateMessage,
  DocumentDeleteMessage,
  DocumentListMessage,
  DocumentUpdateMessage,
} from '@hai/service-web';
import { Client } from './client.js';

export class DocumentService {
  constructor(private readonly client: Client) {}

  async createDocument(content: string) {
    const req: DocumentCreateMessage = buildMessage('Document.Create', {
      payload: {
        content,
      },
    });
    await this.client.sendAndWait(req);
  }

  async deleteDocument(id: string) {
    const req: DocumentDeleteMessage = buildMessage('Document.Delete', {
      payload: {
        id,
      },
    });

    await this.client.sendAndWait(req);
  }

  async getDocuments(): Promise<Array<{ id: string; content: string }>> {
    const req: DocumentListMessage = buildMessage('Document.List');
    const res = await this.client.sendAndWait(req);

    if (assertApiSuccess(res)) {
      console.log(res.payload.documents);
      return res.payload.documents;
    } else {
      console.log(res.payload.errors);
      throw new Error('Error');
    }
  }

  async updateDocument(id: string, content: string) {
    const req: DocumentUpdateMessage = buildMessage('Document.Update', {
      payload: {
        id,
        content,
      },
    });
    return this.client.sendAndWait(req);
  }
}
