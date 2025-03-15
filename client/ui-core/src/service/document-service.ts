import {
  buildMessage,
  DocumentCreateMessage,
  DocumentCreateResponseMessage,
  DocumentCreateResponsePayload,
  DocumentDeleteMessage,
  DocumentDeleteResponseMessage,
  DocumentDeleteResponsePayload,
  DocumentGetMessage,
  DocumentGetResponseMessage,
  DocumentGetResponsePayload,
  DocumentListMessage,
  DocumentListResponseMessage,
  DocumentListResponsePayload,
  DocumentUpdateMessage,
  DocumentUpdateResponseMessage,
  DocumentUpdateResponsePayload,
} from '@hai/service-web';
import {
  Client,
  asSimpleResponseMessage,
  SimpleMessageResponse,
} from './client.js';

export class DocumentService {
  constructor(private readonly client: Client) {}

  async createDocument(
    content: string
  ): Promise<SimpleMessageResponse<DocumentCreateResponsePayload>> {
    const req: DocumentCreateMessage = buildMessage('Document.Create', {
      payload: {
        content,
      },
    });
    const res = await this.client.sendAndWait<
      DocumentCreateMessage,
      DocumentCreateResponseMessage
    >(req);
    return asSimpleResponseMessage(res);
  }

  async deleteDocument(
    id: string
  ): Promise<SimpleMessageResponse<DocumentDeleteResponsePayload>> {
    const req: DocumentDeleteMessage = buildMessage('Document.Delete', {
      payload: {
        id,
      },
    });
    const res = await this.client.sendAndWait<
      DocumentDeleteMessage,
      DocumentDeleteResponseMessage
    >(req);
    return asSimpleResponseMessage(res);
  }

  async getDocument(
    id: string
  ): Promise<SimpleMessageResponse<DocumentGetResponsePayload>> {
    const req: DocumentGetMessage = buildMessage('Document.Get', {
      payload: {
        id,
      },
    });
    const res = await this.client.sendAndWait<
      DocumentGetMessage,
      DocumentGetResponseMessage
    >(req);
    return asSimpleResponseMessage(res);
  }

  async getDocuments(): Promise<
    SimpleMessageResponse<DocumentListResponsePayload>
  > {
    const req: DocumentListMessage = buildMessage('Document.List');
    const res = await this.client.sendAndWait<
      DocumentListMessage,
      DocumentListResponseMessage
    >(req);
    return asSimpleResponseMessage(res);
  }

  async updateDocument(
    id: string,
    content: string
  ): Promise<SimpleMessageResponse<DocumentUpdateResponsePayload>> {
    const req: DocumentUpdateMessage = buildMessage('Document.Update', {
      payload: {
        id,
        content,
      },
    });
    const res = await this.client.sendAndWait<
      DocumentUpdateMessage,
      DocumentUpdateResponseMessage
    >(req);
    return asSimpleResponseMessage(res);
  }
}
