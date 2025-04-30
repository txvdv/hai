import { Document } from './Document.js';
import { DocumentID } from './DocumentID.js';

export interface DocumentRepository {
  clear(): void;

  deleteDocument(id: DocumentID): void;

  findDocuments(href?: string, count?: number): Promise<Document[]>;

  findLatestDocument(): Promise<Document | null>;

  getDocuments(qry: GetDocumentsQueryParams): Promise<Document[]>;

  load(id: DocumentID): Promise<Document>;

  save(doc: Document): void;
}

export type GetDocumentsQueryParams = {
  orderBy: 'date' | 'title';
  orderDirection: 'asc' | 'desc';
};
