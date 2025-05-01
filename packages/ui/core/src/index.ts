import { DocumentBrowserViewModel } from './document-browser/view-model.js';
import { DocumentService } from './application/services/DocumentService.js';
import { SwDocumentService } from './infrastructure/SwDocumentService.js';

export class UiCore {
  private readonly documentService: DocumentService;

  constructor() {
    this.documentService = new SwDocumentService();
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

export type { DocumentService };
export { DocumentBrowserViewModel };
export type { DocumentBrowserViewState } from './document-browser/view-model.js';
