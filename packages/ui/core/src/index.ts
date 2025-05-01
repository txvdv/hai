import { DocumentBrowserViewModel } from './document-browser/view-model.js';
import { DocumentService } from './application/services/DocumentService.js';

export class UiCore {
  private readonly documentService: DocumentService;

  constructor(deps: { documentService: DocumentService }) {
    this.documentService = deps.documentService;
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

export { err, ok } from './application/services/Result.js';
export type { Result } from './application/services/Result.js';

export type { DocumentService };
export { DocumentBrowserViewModel };
export type { DocumentBrowserViewState } from './document-browser/view-model.js';
