export * from './lib/ui-core.js';
import { DocumentService } from './service/document-service.js';

export class UiCore {
  constructor() {}

  getDocumentService() {
    return new DocumentService();
  }
}
