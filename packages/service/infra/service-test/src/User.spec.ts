import assert from 'assert';
import { AppTester } from './app.tester.js';
import { CreateUser } from '@hai/service-core';

describe('User', () => {
  let appTest: AppTester;

  beforeEach(() => {
    appTest = new AppTester();
  });

  afterEach(() => {
    appTest.teardown();
  });

  describe('CreateUser', () => {
    test('should return a string', async () => {
      const command = new CreateUser();
      const createRes = await appTest.sendAndWait(command);
      assert(createRes.success);
    });

    test('should return an error if a user already exists', async () => {
      const command = new CreateUser();
      await appTest.sendAndWait(command);
      const createRes = await appTest.sendAndWait(command);
      assert(!createRes.success);
    });
  });
});
