import { Document } from './document.service.js';

export interface DocumentRepository {
  getDocument(id: string): Promise<Document | null>;

  getDocuments(): Promise<Document[]>;

  save(doc: Document): void;

  deleteDocument(id: string): void;
}

export class InMemoryDocumentRepository implements DocumentRepository {
  documents: Document[] = [];

  async getDocument(id: string) {
    const doc = this.documents.find((doc) => doc.id === id);
    if (!doc) return null;
    return doc;
  }

  async getDocuments() {
    return this.documents;
  }

  save(doc: Document) {
    const existingIndex = this.documents.findIndex(
      (existingDoc) => existingDoc.id === doc.id
    );
    if (existingIndex !== -1) {
      this.documents[existingIndex] = doc;
    } else {
      this.documents.push(doc);
    }
  }

  deleteDocument(id: string) {
    this.documents = this.documents.filter((doc) => doc.id !== id);
  }
}
