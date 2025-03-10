import Dexie, { EntityTable } from 'dexie';
import { DocumentEntity } from './document-repository.js';

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
      documents: '++id,content'
    });
    this.documents.mapToClass(DocumentEntity);
  }

  // Add an operation to the queue
  addOperation(
    table: Dexie.Table<any, any>,
    operation: () => Promise<void>
  ): void {
    this.operationQueue.push({
      table,
      operation
    });
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