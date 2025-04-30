import 'fake-indexeddb/auto';
import { User } from '@hai/core-service';
import { DxDatabase } from './database.js';
import { DxUserRepository } from './DxUserRepository.js';
import { UnitOfWork } from './unit-of-work.js';

describe('DxUserRepository', () => {
  let db: DxDatabase;
  let uow: UnitOfWork;
  let repository: DxUserRepository;

  beforeEach(() => {
    db = new DxDatabase();
    uow = new UnitOfWork(db);
    repository = new DxUserRepository(db);
  });

  afterEach(async () => {
    await db.deleteDb();
  });

  describe('clear', () => {
    it('should clear the user from the database', async () => {
      const user = User.withDefaultPreferences();

      uow.start();
      repository.save(user);
      await uow.commit();

      uow.start();
      repository.clear();
      await uow.commit();

      const users = await db.users.toArray();

      expect(users).toHaveLength(0);
    });
  });

  describe('getCreated', () => {
    it('should retrieve the created user', async () => {
      const user = User.withDefaultPreferences();

      uow.start();
      repository.save(user);
      await uow.commit();

      const result = await repository.getCreated();

      expect(result.getIdentifier().toString()).toBe(
        user.getIdentifier().toString()
      );
    });

    it('should throw an error if no user is found', async () => {
      await expect(repository.getCreated()).rejects.toThrow(
        'Local user not found'
      );
    });
  });

  describe('hasUser', () => {
    it('should return true if a user exists in the database', async () => {
      const user = User.withDefaultPreferences();

      uow.start();
      repository.save(user);
      await uow.commit();

      const hasUser = await repository.hasUser();

      expect(hasUser).toBe(true);
    });

    it('should return false if no user exists in the database', async () => {
      const hasUser = await repository.hasUser();
      expect(hasUser).toBe(false);
    });
  });

  describe('load', () => {
    it('should load the created user by ID', async () => {
      const user = User.withDefaultPreferences();

      uow.start();
      repository.save(user);
      await uow.commit();

      const result = await repository.load(user.getIdentifier());

      expect(result.getIdentifier().toString()).toBe(
        user.getIdentifier().toString()
      );
    });
  });

  describe('save', () => {
    it('should save a user to the database', async () => {
      const user = User.withDefaultPreferences();

      uow.start();
      repository.save(user);
      await uow.commit();

      const users = await db.users.toArray();

      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(user.getIdentifier().toString());
    });
  });
});
