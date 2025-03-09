import { createUUID } from '@hai/shared-utils';

export type Document = {
  id: string
  content: string
};

export class DocumentService {
  documentRepository: DocumentRepository;

  constructor(deps: {
    documentRepository: DocumentRepository
  }) {
    this.documentRepository = deps.documentRepository;
  }

  async getDocument(id: string) {
    return this.documentRepository.getDocument(id);
  }

  async getDocuments() {
    return this.documentRepository.getDocuments();
  }

  async createDocument(content: string) {
    const document = {
      id: createUUID(),
      content
    };
    await this.documentRepository.save(document);
    return document;
  }

  async updateDocument(id: string, content: string) {
    const document = await this.documentRepository.getDocument(id)
    if (document) {
      document.content = content;
      await this.documentRepository.save(document);
    }
  }

  async deleteDocument(id: string) {
    return this.documentRepository.deleteDocument(id);
  }
}

export interface DocumentRepository {
  getDocument(id: string): Promise<Document | undefined>;

  getDocuments(): Promise<Document[]>;

  save(doc: Document): Promise<void>;

  deleteDocument(id: string): Promise<void>;
}

export class InMemoryDocumentRepository implements DocumentRepository {
  documents: Document[] = [];

  async getDocument(id: string) {
    return this.documents.find(doc => doc.id === id);
  }

  async getDocuments() {
    return this.documents;
  }

  async save(doc: Document) {
    this.documents.push(doc);
  }

  async deleteDocument(id: string) {
    this.documents = this.documents.filter(doc => doc.id !== id);
  }
}