import 'fake-indexeddb/auto';
import { AppTester } from './app.tester.js';
import { CreateDocument, GetDocument } from '@hai/core-service';

describe('Document Service', () => {
  let appTest: AppTester;

  beforeEach(() => {
    appTest = new AppTester();
  });

  test('Creating a document', async () => {
    const createRes = await appTest.sendAndWait(CreateDocument, {
      content: 'test content',
    });
    console.log('createRes', createRes);

    const getRes = await appTest.sendAndWait(GetDocument, {
      id: createRes.value.id,
    });
    console.log('getRes', getRes);
    expect(getRes.isSuccess).toBeTruthy;
  });
});
