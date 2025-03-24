import 'fake-indexeddb/auto';
import { AppTester } from './app.tester.js';
import {
  CreateDocument,
  DeleteDocument,
  GetDocument,
  ListDocuments,
} from '@hai/core-service';
import assert from 'assert';

describe('Document Service', () => {
  let appTest: AppTester;

  beforeEach(() => {
    appTest = new AppTester();
  });

  test('Creating a document', async () => {
    const createRes = await appTest.sendAndWait(CreateDocument, {
      content: 'test content',
    });
    assert(createRes.success);

    const getRes = await appTest.sendAndWait(GetDocument, {
      id: createRes.data.id,
    });
    expect(getRes.success).toBeTruthy;
  });

  test('Deleting a document', async () => {
    const createRes = await appTest.sendAndWait(CreateDocument, {
      content: 'test content',
    });
    assert(createRes.success);

    const listRes = await appTest.sendAndWait(ListDocuments, undefined);
    expect(listRes.success).toBeTruthy;

    const delRes = await appTest.sendAndWait(DeleteDocument, {
      id: createRes.data.id,
    });
    expect(delRes.success).toBeTruthy;

    const listResAfterDel = await appTest.sendAndWait(ListDocuments, undefined);
    expect(listResAfterDel.success).toBeTruthy;
  });
});
