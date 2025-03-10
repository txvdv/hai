import Dexie, { type EntityTable } from 'dexie';
import { Entity } from 'dexie';

export class DxDatabase extends Dexie {
  documents!: EntityTable<DocumentEntity, 'id'>;

  // A queue to store pending operations for transactional processing
  operationQueue: Array<{
    table: Dexie.Table<any, any>;
    operation: () => Promise<void>;
  }> = [];

  constructor() {
    super('HaiDB');
    this.version(1).stores({
      documents: '++id,content',
    });
    this.documents.mapToClass(DocumentEntity);
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

class DocumentEntity extends Entity<DxDatabase> {
  id!: string;
  content!: string;
}

export class DxDocumentRepository {
  constructor(
    private db: DxDatabase) {
  }

  async getDocument(id: string): Promise<DocumentEntity | null> {
    const doc = await this.db.documents.get(id);
    if (!doc) return null;
    return doc
  }

  async getDocuments(): Promise<DocumentEntity[]> {
    return this.db.documents.toArray();
  }

  save(doc: DocumentEntity): void {
    this.db.addOperation(this.db.documents, async () => {
      await this.db.documents.add(doc); // Add the document
    });
  }

  deleteDocument(id: string): void {
    this.db.addOperation(this.db.documents, async () => {
      await this.db.documents.delete(id); // Delete the document
    });
  }
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
