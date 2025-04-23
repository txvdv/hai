import Dexie from 'dexie';
import { type Table } from 'dexie';
import { UserEntityRecord } from './DxUserRepository.js';
import { DocumentRecord } from './DxDocumentRepository.js';

export class DxDatabase extends Dexie {
  documents!: Table<DocumentRecord, string>;
  users!: Table<UserEntityRecord, string>;

  // A queue to store pending operations for transactional processing
  operationQueue: Array<{
    table: Dexie.Table<any, any>;
    operation: () => Promise<void>;
  }> = [];

  constructor() {
    super('HaiDB');
    this.version(1).stores({
      documents: 'id,content',
      users: 'id,preferences',
    });
  }

  // Add an operation to the queue
  addOperation(
    table: Dexie.Table<any, any>,
    operation: () => Promise<void>
  ): void {
    this.operationQueue.push({
      table,
      operation,
    });
  }

  // Clear the operation queue (called after a successful commit)
  clearOperationQueue(): void {
    this.operationQueue = [];
  }

  deleteDb() {
    this.delete();
  }

  // Retrieve the current operation queue
  getOperationQueue(): Array<{
    table: Dexie.Table<any, any>;
    operation: () => Promise<void>;
  }> {
    return this.operationQueue;
  }
}
