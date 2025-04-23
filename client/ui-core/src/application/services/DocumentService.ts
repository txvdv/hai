import type { DocumentComponents } from '@hai/service-web';
import { Result } from './Result.js';

export type Document = DocumentComponents['schemas']['Document'];
export type CreateDocumentPayload =
  DocumentComponents['schemas']['CreateDocument'];
export type DeleteDocumentPayload =
  DocumentComponents['schemas']['DeleteDocument'];
export type GetDocumentPayload = DocumentComponents['schemas']['GetDocument'];
export type UpdateDocumentPayload =
  DocumentComponents['schemas']['UpdateDocument'];

export interface DocumentService {
  createDocument(
    payload: CreateDocumentPayload
  ): Promise<Result<{ id: string }>>;

  deleteDocument(payload: DeleteDocumentPayload): Promise<Result<void>>;

  getDocument(payload: GetDocumentPayload): Promise<Result<Document>>;

  getDocuments(): Promise<Result<Document[]>>;

  updateDocument(payload: UpdateDocumentPayload): Promise<Result<void>>;
}
