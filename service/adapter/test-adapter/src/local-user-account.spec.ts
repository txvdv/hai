import assert from 'assert';
import 'fake-indexeddb/auto';
import { AppTester } from './app.tester.js';
import {
  CreateLocalUserAccount,
  CreateLocalUserAccountResult,
  DeleteLocalUserAccount,
  DeleteLocalUserAccountResult,
  EntityNotFoundError,
  GetLocalUserAccount,
  GetLocalUserAccountResult,
  LocalUserAccountAlreadyExistsError,
} from '@hai/core-service';

describe('Local User Account', () => {
  let appTest: AppTester;

  beforeEach(() => {
    appTest = new AppTester();
  });

  afterEach(() => {
    appTest.teardown();
  });

  describe('CreateLocalUserAccount', () => {
    test('should return Ok with the created accountId', async () => {
      const createRes = await appTest.sendAndAwait<
        CreateLocalUserAccount,
        CreateLocalUserAccountResult
      >({
        type: 'CreateLocalUserAccount',
      });
      assert(createRes.success);
      expect(createRes.data.id).toBeDefined();
    });

    test('should return LocalUserAccountAlreadyExists when an account already exists', async () => {
      await appTest.sendAndAwait<
        CreateLocalUserAccount,
        CreateLocalUserAccountResult
      >({
        type: 'CreateLocalUserAccount',
      });

      const createRes = await appTest.sendAndAwait<
        CreateLocalUserAccount,
        CreateLocalUserAccountResult
      >({
        type: 'CreateLocalUserAccount',
      });

      assert(!createRes.success);
      expect(createRes.error.name).toBe(
        LocalUserAccountAlreadyExistsError.name
      );
    });
  });

  describe('DeleteLocalUserAccount', () => {
    test('should delete the account', async () => {
      await appTest.sendAndAwait<
        CreateLocalUserAccount,
        CreateLocalUserAccountResult
      >({
        type: 'CreateLocalUserAccount',
      });
      const delRes = await appTest.sendAndAwait<
        DeleteLocalUserAccount,
        DeleteLocalUserAccountResult
      >({
        type: 'DeleteLocalUserAccount',
      });
      assert(delRes.success);
    });

    test('should return EntityNotFound when no account exists', async () => {
      const delRes = await appTest.sendAndAwait<
        DeleteLocalUserAccount,
        DeleteLocalUserAccountResult
      >({
        type: 'DeleteLocalUserAccount',
      });
      assert(!delRes.success);
      expect(delRes.error.name).toBe(EntityNotFoundError.name);
    });
  });

  describe('GetLocalUserAccount', () => {
    test('should return Ok with the LocalUserAccount', async () => {
      const createRes = await appTest.sendAndAwait<
        CreateLocalUserAccount,
        CreateLocalUserAccountResult
      >({
        type: 'CreateLocalUserAccount',
      });
      assert(createRes.success);

      const getRes = await appTest.sendAndAwait<
        GetLocalUserAccount,
        GetLocalUserAccountResult
      >({
        type: 'GetLocalUserAccount',
      });
      assert(getRes.success);
      expect(getRes.data.id).toEqual(createRes.data.id);
    });

    test('should return EntityNotFound when no account exists', async () => {
      const getRes = await appTest.sendAndAwait<
        GetLocalUserAccount,
        GetLocalUserAccountResult
      >({
        type: 'GetLocalUserAccount',
      });
      assert(!getRes.success);
      expect(getRes.error.name).toBe(EntityNotFoundError.name);
    });
  });
});
