import Dexie, { EntityTable } from 'dexie';
import { DocumentEntity } from './document-repository.js';
import { LocalUserAccountEntity } from './local-user-account-repository.js';

export class DxDatabase extends Dexie {
  documents!: EntityTable<DocumentEntity, 'id'>;
  localUserAccounts!: EntityTable<LocalUserAccountEntity, 'id'>;

  // A queue to store pending operations for transactional processing
  operationQueue: Array<{
    table: Dexie.Table<any, any>;
    operation: () => Promise<void>;
  }> = [];

  constructor() {
    super('HaiDB');
    this.version(1).stores({
      documents: '++id,content',
      localUserAccounts: '++id',
    });
    this.documents.mapToClass(DocumentEntity);
    this.localUserAccounts.mapToClass(LocalUserAccountEntity);
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

  // Retrieve the current operation queue
  getOperationQueue(): Array<{
    table: Dexie.Table<any, any>;
    operation: () => Promise<void>;
  }> {
    return this.operationQueue;
  }
}
