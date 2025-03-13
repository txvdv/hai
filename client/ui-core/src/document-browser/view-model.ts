import { ComposedDocument, ProblemDetails } from '@hai/service-web';
import { Observable } from '../Observable.js';
import { DocumentService } from '../service/document-service.js';

export type DocumentBrowserViewState = {
  documents: ComposedDocument[];
  problem: ProblemDetails | null;
};

const initialDocumentBrowserViewState: DocumentBrowserViewState = {
  documents: [],
  problem: null,
};

export class DocumentBrowserViewModel extends Observable<DocumentBrowserViewState> {
  documentService: DocumentService;

  constructor(deps: { documentService: DocumentService }) {
    super(initialDocumentBrowserViewState);
    this.documentService = deps.documentService;
  }

  async createDocument(content: string) {
    const req = await this.documentService.createDocument(content);

    if (req.status === 'success') {
      this.setState({ documents: [...this.getState().documents, req.payload] });
    } else {
      this.setState({ problem: req.payload });
    }
  }

  async deleteDocument(id: string) {
    const req = await this.documentService.deleteDocument(id);

    if (req.status === 'success') {
      const documents = this.getState().documents.filter(
        (doc) => doc.id !== id
      );
      this.setState({ documents });
    } else {
      this.setState({ problem: req.payload });
    }
  }

  async loadDocuments() {
    const req = await this.documentService.getDocuments();

    if (req.status === 'success') {
      this.setState({ documents: req.payload.documents });
    } else {
      this.setState({ problem: req.payload });
    }
  }

  async saveDocument(content: string, id?: string) {
    if (!id) {
      return this.createDocument(content);
    }

    const req = await this.documentService.updateDocument(id, content);

    if (req.status === 'success') {
      const documents = this.getState().documents.filter(
        (doc) => doc.id !== id
      );
      this.setState({ documents });
    } else {
      this.setState({ problem: req.payload });
    }
  }
}
