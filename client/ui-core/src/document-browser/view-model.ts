import { ProblemDetails } from '@hai/service-web';
import { Observable } from '../Observable.js';
import {
  Document,
  DocumentService,
} from '../application/services/DocumentService.js';

export type DocumentBrowserViewState = {
  documents: Document[];
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
    const res = await this.documentService.createDocument({ content });

    if (!res.ok) {
      this.setState({ problem: res.error });
    }
  }

  async deleteDocument(id: string) {
    const res = await this.documentService.deleteDocument({ id });

    if (res.ok) {
      const documents = this.getState().documents.filter(
        (doc) => doc.id !== id
      );
      this.setState({ documents });
    } else {
      this.setState({ problem: res.error });
    }
  }

  async loadDocuments() {
    const res = await this.documentService.getDocuments();

    if (res.ok) {
      this.setState({ documents: res.data });
    } else {
      this.setState({ problem: res.error });
    }
  }

  async saveDocument(content: string, id?: string) {
    if (!id) {
      return this.createDocument(content);
    }

    const res = await this.documentService.updateDocument({
      id,
      content,
    });

    if (res.ok) {
      await this.loadDocuments();
    } else {
      this.setState({ problem: res.error });
    }
  }
}
