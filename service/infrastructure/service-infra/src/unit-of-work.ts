import { DxDatabase } from './database.js';

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