import assert from 'assert';
import 'fake-indexeddb/auto';
import { AppTester } from './app.tester.js';
import {
  CreateDocument,
  CreateDocumentResult,
  DeleteDocument,
  DeleteDocumentResult,
  ListDocuments,
  ListDocumentsResult,
} from '@hai/core-service';

describe('Document Service', () => {
  let appTest: AppTester;

  beforeEach(() => {
    appTest = new AppTester();
  });

  test('Creating a document', async () => {
    const res = await appTest.sendAndAwait<
      CreateDocument,
      CreateDocumentResult
    >({
      type: 'CreateDocumentCommand',
      payload: {
        content: 'test content',
      },
    });
    assert(res.success);
    console.log(res.data.id);
  });

  test('Deleting a document', async () => {
    const createRes = await appTest.sendAndAwait<
      CreateDocument,
      CreateDocumentResult
    >({
      type: 'CreateDocumentCommand',
      payload: {
        content: 'test content',
      },
    });
    assert(createRes.success);

    const listRes = await appTest.sendAndAwait<
      ListDocuments,
      ListDocumentsResult
    >({
      type: 'ListDocumentsQuery',
    });
    expect(listRes.success).toBeTruthy;

    const delRes = await appTest.sendAndAwait<
      DeleteDocument,
      DeleteDocumentResult
    >({
      type: 'DeleteDocumentCommand',
      payload: {
        id: createRes.data.id,
      },
    });

    expect(delRes.success).toBeTruthy;

    const listResAfterDel = await appTest.sendAndAwait<
      ListDocuments,
      ListDocumentsResult
    >({
      type: 'ListDocumentsQuery',
    });
    expect(listResAfterDel.success).toBeTruthy;
  });
});
