import { Client } from './service/client.js';
import { DocumentService } from './service/document-service.js';
import { DocumentBrowserViewModel } from './document-browser/view-model.js';
export * from './lib/ui-core.js';

export class UiCore {
  private readonly client: Client;
  private readonly documentService: DocumentService;

  constructor() {
    this.client = new Client();
    this.documentService = new DocumentService(this.client);
  }

  getDocumentService() {
    return this.documentService;
  }

  getDocumentBrowserViewModel() {
    return new DocumentBrowserViewModel({
      documentService: this.documentService,
    });
  }
}

export { DocumentService };
export { createMockDocumentService } from './service/document-service.mock.js';
export type { MockDocumentService } from './service/document-service.mock.js';

export { DocumentBrowserViewModel };
export type { DocumentBrowserViewState } from './document-browser/view-model.js';
