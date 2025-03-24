import assert from 'assert';
import 'fake-indexeddb/auto';
import { AppTester } from './app.tester.js';
import {
  CreateLocalUserAccount,
  DeleteLocalUserAccount,
  GetLocalUserAccount,
} from '@hai/core-service';

describe('Local User Account', () => {
  let appTest: AppTester;

  beforeEach(() => {
    appTest = new AppTester();
  });

  test('Creating a user', async () => {
    const createRes = await appTest.sendAndWait(
      CreateLocalUserAccount,
      undefined
    );
    assert(createRes.success);

    const getRes = await appTest.sendAndWait(GetLocalUserAccount, undefined);
    expect(getRes.success).toBeTruthy;
  });

  test('Deleting a user', async () => {
    const createRes = await appTest.sendAndWait(
      CreateLocalUserAccount,
      undefined
    );
    assert(createRes.success);

    const delRes = await appTest.sendAndWait(DeleteLocalUserAccount, undefined);
    assert(delRes.success);
  });
});
