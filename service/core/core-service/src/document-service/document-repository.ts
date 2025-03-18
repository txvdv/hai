import { Document } from './document-service.js';

export interface DocumentRepository {
  getDocument(id: string): Promise<Document | null>;

  getDocuments(): Promise<Document[]>;

  save(doc: Document): void;

  deleteDocument(id: string): void;
}