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
    const result = await appTest.sendAndAwait<
      CreateDocument,
      CreateDocumentResult
    >({
      type: 'CreateDocumentCommand',
      payload: {
        content: 'test content',
      },
    });
    assert(result.success);
    console.log(result.data.id);
  });

  test('Deleting a document', async () => {
    const createResult = await appTest.sendAndAwait<
      CreateDocument,
      CreateDocumentResult
    >({
      type: 'CreateDocumentCommand',
      payload: {
        content: 'test content',
      },
    });
    assert(createResult.success);

    const listResult = await appTest.sendAndAwait<
      ListDocuments,
      ListDocumentsResult
    >({
      type: 'ListDocumentsQuery',
    });
    expect(listResult.success).toBeTruthy;

    const delResult = await appTest.sendAndAwait<
      DeleteDocument,
      DeleteDocumentResult
    >({
      type: 'DeleteDocumentCommand',
      payload: {
        id: createResult.data.id,
      },
    });

    expect(delResult.success).toBeTruthy;

    const listResultAfterDel = await appTest.sendAndAwait<
      ListDocuments,
      ListDocumentsResult
    >({
      type: 'ListDocumentsQuery',
    });
    expect(listResultAfterDel.success).toBeTruthy;
  });
});
