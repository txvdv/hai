import 'fake-indexeddb/auto';
import { DxDatabase } from './database.js';
import { UnitOfWork } from './unit-of-work.js';
import { DxLocalUserAccountRepository } from './local-user-account-repository.js';

describe('Local User Account Repository', () => {
  let db: DxDatabase;
  let uow: UnitOfWork;
  let repo: DxLocalUserAccountRepository;

  // Setup a new database instance before each test
  beforeEach(() => {
    db = new DxDatabase();
    uow = new UnitOfWork(db);
    repo = new DxLocalUserAccountRepository(db);
  });

  // Clear the database after each test
  afterEach(async () => {
    // Clear all data in the `documents` table
    await db.localUserAccounts.clear();
  });

  describe('save', () => {
    it('should save a local user account', async () => {
      const exampleAccount = { id: 'test-account-id' };

      // Save the user
      uow.start();
      repo.save(exampleAccount);
      await uow.commit();

      // Verify the account exists in the database
      const storedAccount = await db.localUserAccounts.get(exampleAccount.id);
      expect(storedAccount).toEqual(exampleAccount);
    });
  });

  describe('getLocalUser', () => {
    it('should return a local user if it exists', async () => {
      const exampleAccount = { id: 'existing-user-id' };

      // Save the user
      uow.start();
      repo.save(exampleAccount);
      await uow.commit();

      const localUser = await repo.getLocalUser();

      expect(localUser).toEqual(exampleAccount);
    });

    it('should throw an error if the local user does not exist', async () => {
      await expect(repo.getLocalUser()).rejects.toThrow('Local user not found');
    });
  });

  describe('hasLocalUser', () => {
    it('should return `true` if a local user account exists', async () => {
      const exampleAccount = { id: 'existing-user-id' };

      // Save the user
      uow.start();
      repo.save(exampleAccount);
      await uow.commit();

      const result = await repo.hasLocalUser();

      expect(result).toBe(true);
    });

    it('should return `false` if no local user account exists', async () => {
      const result = await repo.hasLocalUser();

      expect(result).toBe(false);
    });
  });

  describe('deleteLocalUser', () => {
    it('should delete the local user account if it exists', async () => {
      const exampleAccount = { id: 'delete-id' };

      // Save the user
      uow.start();
      repo.save(exampleAccount);
      await uow.commit();

      // Delete the user account
      uow.start();
      repo.deleteLocalUser();
      await uow.commit();

      const result = await db.localUserAccounts.get(exampleAccount.id);
      expect(result).toBeUndefined();
    });

    it('should throw an error if no local user account exists', async () => {
      await expect(async () => {
        uow.start();
        repo.deleteLocalUser();
        await uow.commit();
      }).rejects.toThrow('Local user not found');
    });
  });
});
