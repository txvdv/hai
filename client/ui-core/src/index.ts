import { Client } from './service/client.js';
import { DocumentService } from './service/document-service.js';
export * from './lib/ui-core.js';

export class UiCore {
  private readonly client: Client;

  constructor() {
    this.client = new Client();
  }

  getDocumentService() {
    return new DocumentService(this.client);
  }
}
