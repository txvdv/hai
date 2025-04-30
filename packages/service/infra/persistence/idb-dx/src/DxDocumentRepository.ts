import { DxDatabase } from './database.js';
import { DocumentID, Document, DocumentRepository } from '@hai/core-service';

export interface DocumentRecord {
  id: string;
  content: string;
}

export class DxDocumentRepository implements DocumentRepository {
  constructor(private db: DxDatabase) {}

  clear(): void {
    this.db.addOperation(this.db.documents, async () => {
      await this.db.documents.clear();
    });
  }

  deleteDocument(id: DocumentID): void {
    this.db.addOperation(this.db.documents, async () => {
      await this.db.documents.delete(id.toString());
    });
  }

  async findDocuments(href?: string, count?: number): Promise<Document[]> {
    const docs = await this.db.documents.toArray();
    return docs.map(asEntity);
  }

  async findLatestDocument(): Promise<Document | null> {
    const [doc] = await this.db.documents.toArray();
    if (!doc) return null;
    return asEntity(doc);
  }

  async getDocuments(): Promise<Document[]> {
    const docs = await this.db.documents.toArray();
    return docs.map(asEntity);
  }

  async load(id: DocumentID): Promise<Document> {
    const doc = await this.db.documents.get(id.toString());
    if (!doc) throw new Error('Document not found');
    return asEntity(doc);
  }

  save(doc: Document): void {
    this.db.addOperation(this.db.documents, async () => {
      await this.db.documents.put(asRecord(doc));
    });
  }
}

function asRecord(dom: Document): DocumentRecord {
  const state = dom.getState();
  return {
    id: state.id,
    content: state.content,
  };
}

function asEntity(rec: DocumentRecord): Document {
  return Document.createFromState(rec);
}
