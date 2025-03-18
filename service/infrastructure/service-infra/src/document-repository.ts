import { Entity } from 'dexie';
import type { ComposedDocument, DocumentRepository } from '@hai/core-service';
import { DxDatabase } from './database.js';

export class DocumentEntity extends Entity<DxDatabase> {
  id!: string;
  content!: string;
}

export class DxDocumentRepository implements DocumentRepository {
  constructor(private db: DxDatabase) {}

  async getDocument(id: string): Promise<ComposedDocument | null> {
    const doc = await this.db.documents.get(id);
    if (!doc) return null;
    return asDocument(doc);
  }

  async getDocuments(): Promise<ComposedDocument[]> {
    const docs = await this.db.documents.toArray();
    return docs.map(asDocument);
  }

  save(doc: ComposedDocument): void {
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

function mapToDocumentEntity(doc: ComposedDocument): DocumentEntity {
  return doc as unknown as DocumentEntity;
}

function asDocument(entity: DocumentEntity): ComposedDocument {
  return {
    id: entity.id,
    content: entity.content,
  };
}
