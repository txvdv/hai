import assert from 'assert';
import 'fake-indexeddb/auto';
import { AppTester } from './app.tester.js';
import {
  CreateLocalUserAccount,
  DeleteLocalUserAccount,
  EntityNotFoundError,
  GetLocalUserAccount,
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
    test('Creating a user', async () => {
      const createRes = await appTest.sendAndWait(
        CreateLocalUserAccount,
        undefined
      );
      assert(createRes.success);
      console.log(createRes.data);

      const getRes = await appTest.sendAndWait(GetLocalUserAccount, undefined);
      expect(getRes.success).toBeTruthy;
    });

    test('should return an error when an account is already present', async () => {
      await appTest.sendAndWait(CreateLocalUserAccount, undefined);

      const createRes = await appTest.sendAndWait(
        CreateLocalUserAccount,
        undefined
      );
      assert(!createRes.success);
      expect(createRes.error.name).toBe(
        LocalUserAccountAlreadyExistsError.name
      );
    });
  });

  describe('DeleteLocalUserAccount', () => {
    test('should delete the account', async () => {
      const createRes = await appTest.sendAndWait(
        CreateLocalUserAccount,
        undefined
      );
      assert(createRes.success);

      const delRes = await appTest.sendAndWait(
        DeleteLocalUserAccount,
        undefined
      );
      assert(delRes.success);
    });

    test('should return an error when no account exists', async () => {
      const delRes = await appTest.sendAndWait(
        DeleteLocalUserAccount,
        undefined
      );
      assert(!delRes.success);
      expect(delRes.error.name).toBe(EntityNotFoundError.name);
    });
  });
});
