import assert from 'assert';
import { AppTester } from './app.tester.js';
import {
  CreateDocumentCommand,
  DeleteDocumentCommand,
  GetDocumentsQuery,
} from '@hai/core-service';

describe('Document', () => {
  let appTest: AppTester;

  beforeEach(() => {
    appTest = new AppTester();
  });

  afterEach(() => {
    appTest.teardown();
  });

  test('Creating a document', async () => {
    const result = await appTest.sendAndWait(
      new CreateDocumentCommand('test content')
    );
    assert(result.success);
  });

  test('Deleting a document', async () => {
    const createResult = await appTest.sendAndWait(
      new CreateDocumentCommand('test content')
    );
    assert(createResult.success);

    const listResult = await appTest.sendAndWait(new GetDocumentsQuery());
    expect(listResult.success).toBeTruthy;

    const delResult = await appTest.sendAndWait(
      new DeleteDocumentCommand(createResult.data.id)
    );
    expect(delResult.success).toBeTruthy;

    const listResultAfterDel = await appTest.sendAndWait(
      new GetDocumentsQuery()
    );
    expect(listResultAfterDel.success).toBeTruthy;
  });
});
