import 'fake-indexeddb/auto';
import { DxDatabase } from './document-repository.js';
import { UnitOfWork } from './document-repository.js';
import { DxDocumentRepository } from './document-repository.js';
import { DxUserRepository } from './document-repository.js';

describe('UnitOfWork Integration Tests', () => {
  let db: DxDatabase;
  let uow: UnitOfWork;
  let docRepo: DxDocumentRepository;
  let userRepo: DxUserRepository;

  // Reset the database and initialize repositories before each test
  beforeEach(async () => {
    db = new DxDatabase();
    uow = new UnitOfWork(db);
    docRepo = new DxDocumentRepository(db);
    userRepo = new DxUserRepository(db);
  });

  // Close the database connection after all tests
  afterEach(async () => {
    await db.users.clear();
    await db.documents.clear();
  });

  test('should commit operations successfully in a single transaction', async () => {
    uow.start();

    // Prepare operations
    const doc = { id: '123', content: 'Test Document Content' };
    const user = { id: '123', name: 'Test User'};

    docRepo.save(doc); // Queue document save
    userRepo.saveUser(user); // Queue user insert

    await uow.commit(); // Commit the transaction

    // Assert: Ensure data was written
    const savedDocs = await db.documents.toArray();
    const savedUsers = await db.users.toArray();
    expect(savedDocs.length).toBe(1);
    expect(savedDocs[0].content).toBe('Test Document Content');
    expect(savedUsers.length).toBe(1);
    expect(savedUsers[0].name).toBe('Test User');
  });

  test('should rollback operations if one operation fails', async () => {
    uow.start();

    // Prepare operations
    const doc = { id: '1', content: 'Test Document Content' };

    docRepo.save(doc); // Queue document save
    userRepo.saveUser({ id: '1', name: 'Test User'});
    // Duplicate user
    userRepo.saveUser({ id: '1', name: 'Test User'});

    // Attempt to commit the transaction
    await expect(uow.commit()).rejects.toThrow(); // Commit should fail

    // Assert: Ensure rollback occurred
    const savedDocs = await db.documents.toArray();
    const savedUsers = await db.users.toArray();
    expect(savedDocs.length).toBe(0); // Documents should not be saved
    expect(savedUsers.length).toBe(0); // Users should not be saved
  });

  test('should handle multiple operations on the same table', async () => {
    uow.start();

    // Queue multiple operations on the same table
    const doc1 = { id: '1', content: 'Document 1' };
    const doc2 = { id: '2', content: 'Document 2' };

    docRepo.save(doc1); // Queue first document save
    docRepo.save(doc2); // Queue second document save

    await uow.commit(); // Commit the transaction

    // Assert: Ensure all operations on the same table were successful
    const savedDocs = await db.documents.toArray();
    expect(savedDocs.length).toBe(2);
    expect(savedDocs.map(d => d.content)).toEqual(['Document 1', 'Document 2']);
  });

  test('should clear operation queue after successful commit', async () => {
    uow.start();

    // Queue operations
    const doc = { id: '1', content: 'Test Document Content' };
    docRepo.save(doc);

    await uow.commit(); // Commit the transaction

    // Assert: Ensure operation queue is cleared
    expect(db.getOperationQueue().length).toBe(0);
  });

  test('should retain operation queue if commit fails', async () => {
    uow.start();

    // Queue valid and invalid operations
    const doc = { id: '1', content: 'Test Document Content' };
    const invalidUser = { id: '1', name: 'Invalid User'}; // Simulate error

    docRepo.save(doc); // Queue document save
    userRepo.saveUser(invalidUser); // Queue invalid user operation

    await expect(uow.commit()).rejects.toThrow(); // Commit should fail

    // Assert: Ensure operation queue is not cleared after failure
    const operations = db.getOperationQueue();
    expect(operations.length).toBe(2);
  });
});