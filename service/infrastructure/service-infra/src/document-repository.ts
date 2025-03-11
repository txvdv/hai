import { Entity } from 'dexie';
import { Document, DocumentRepository } from '@hai/core-service';
import { DxDatabase } from './database.js';

export class DocumentEntity extends Entity<DxDatabase> {
  id!: string;
  content!: string;
}

export class DxDocumentRepository implements DocumentRepository {
  constructor(
    private db: DxDatabase) {
  }

  async getDocument(id: string): Promise<Document | null> {
    const doc = await this.db.documents.get(id);
    if (!doc) return null;
    return doc
  }

  async getDocuments(): Promise<Document[]> {
    return this.db.documents.toArray();
  }

  save(doc: Document): void {
    this.db.addOperation(this.db.documents, async () => {
      await this.db.documents.put(mapToDocumentEntity(doc));
    });
  }

  deleteDocument(id: string): void {
    this.db.addOperation(this.db.documents, async () => {
      await this.db.documents.delete(id); // Delete the document
    });
  }
}

function mapToDocumentEntity(doc: Document): DocumentEntity {
  return doc as unknown as DocumentEntity;
}
