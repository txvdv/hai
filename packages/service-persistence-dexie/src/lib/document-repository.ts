import Dexie, { type EntityTable } from 'dexie';
import { Entity } from 'dexie';
import { Document, DocumentRepository } from '@hai/service-core';

export class DxDatabase extends Dexie {
  documents!: EntityTable<DocumentEntity, 'id'>;
  users!: EntityTable<UserEntity, 'id'>;

  // A queue to store pending operations for transactional processing
  operationQueue: Array<{
    table: Dexie.Table<any, any>;
    operation: () => Promise<void>;
  }> = [];

  constructor() {
    super('HaiDB');
    this.version(1).stores({
      documents: '++id,content',
      users: '++id,name',
    });
    this.documents.mapToClass(DocumentEntity);
    this.users.mapToClass(UserEntity);
  }

  // Add an operation to the queue
  addOperation(
    table: Dexie.Table<any, any>,
    operation: () => Promise<void>
  ): void {
    this.operationQueue.push({ table, operation });
  }

  // Clear the operation queue (called after a successful commit)
  clearOperationQueue(): void {
    this.operationQueue = [];
  }

  // Retrieve the current operation queue
  getOperationQueue(): Array<{
    table: Dexie.Table<any, any>;
    operation: () => Promise<void>;
  }> {
    return this.operationQueue;
  }
}

class UserEntity extends Entity<DxDatabase> {
  id!: string;
  name!: string;
}

type User = {
  id: string;
  name: string;
}

export class DxUserRepository {
  constructor(
    private db: DxDatabase) {
  }

  saveUser(user: User): void {
    this.db.addOperation(this.db.users, async () => {
      await this.db.users.add(user);
    });
  }

  deleteUser(id: string): void {
    this.db.addOperation(this.db.users, async () => {
      await this.db.users.delete(id);
    });
  }
}

class DocumentEntity extends Entity<DxDatabase> {
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
      await this.db.documents.add(mapToDocumentEntity(doc)); // Add the document
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

export class UnitOfWork {
  private db: DxDatabase;
  private activeTransaction: boolean = false;

  constructor(db: DxDatabase) {
    this.db = db;
  }

  start(): void {
    if (this.activeTransaction) {
      throw new Error('A UnitOfWork transaction is already running.');
    }
    this.activeTransaction = true;
  }

  async commit(): Promise<void> {
    if (!this.activeTransaction) {
      throw new Error('No active transaction. Call "start()" before committing.');
    }

    // Get all pending operations from the database
    const operations = this.db.getOperationQueue();
    if (operations.length === 0) {
      throw new Error('No operations to commit.');
    }

    // Collect unique tables from the operations
    const tables = [...new Set(operations.map(op => op.table))];

    try {
      // Perform all operations inside a single transaction
      await this.db.transaction('rw', tables, async () => {
        for (const { operation } of operations) {
          await operation(); // Execute each operation
        }
      });

      // Clear the operation queue after a successful transaction
      this.db.clearOperationQueue();
    } catch (error) {
      console.error('Transaction failed. Rolling back changes.', error);
      throw error; // Rollback happens automatically via Dexie
    } finally {
      this.activeTransaction = false; // Reset active transaction state
    }
  }
}
