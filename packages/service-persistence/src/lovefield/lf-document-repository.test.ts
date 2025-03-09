import type {
  Document
} from '@hai/service-core';
import { LfDocumentRepository } from './lf-document-repository.js';
import { LfDatabase } from './lf-database.js';
import { createUUID } from '@hai/shared-utils';

function buildDocument(content: string): Document {
  return {
    id: createUUID(),
    content
  };
}

const doc1 = buildDocument('1');
const doc2 = buildDocument('2');
const doc3 = buildDocument('3');

describe('LfDocumentRepository', () => {
  let repo: LfDocumentRepository;
  let db: LfDatabase;

  beforeEach(async () => {
    db = new LfDatabase({ testMode: true });
    repo = new LfDocumentRepository({ lfDatabase: db });
    await db.connect();
  });

  afterEach(() => {
    db.close();
  });

  describe('deleteDocument', () => {
    beforeEach(async () => {
      db.start();
      repo.save(doc1);
      repo.save(doc2);
      repo.save(doc3);
      await db.commit();
    });

    it('should delete a document by id if it exists', async () => {
      db.start();
      repo.deleteDocument(doc1.id);
      await db.commit();

      const res = await repo.getDocument(doc1.id);
      expect(res).toBeNull();
    });

    it('should only delete the specified document', async () => {
      db.start();
      repo.deleteDocument(doc2.id);
      await db.commit();

      const remainingDocs = await repo.getDocuments();
      expect(remainingDocs).toEqual([doc1, doc3]);
    });
  });

  describe('getDocument', () => {
    beforeEach(async () => {
      db.start();
      repo.save(doc1);
      repo.save(doc2);
      repo.save(doc3);
      await db.commit();
    });

    it('should return the document by id if it exists', async () => {
      const res = await repo.getDocument(doc1.id);
      expect(res).toEqual(doc1);
    });

    it('should return null if the document does not exist', async () => {
      const res = await repo.getDocument('non-existent-id');
      expect(res).toBeNull();
    });
  });

  describe('getDocuments', () => {
    beforeEach(async () => {
      db.start();
      repo.save(doc1);
      repo.save(doc2);
      repo.save(doc3);
      await db.commit();
    });

    it('should default sort the documents by date modified ascending', async () => {
      const res = await repo.getDocuments();
      expect(res).toEqual([doc1, doc2, doc3]);
    });
  });


  describe('save', () => {
    beforeEach(async () => {
      db.start();
    });

    it('should save a document to the repository', async () => {
      const newDoc = buildDocument('4');
      repo.save(newDoc);
      await db.commit();

      const savedDoc = await repo.getDocument(newDoc.id);
      expect(savedDoc).toEqual(newDoc);
    });

    it('should overwrite the document if it already exists', async () => {
      const updatedDoc = {
        ...doc1,
        content: 'Updated Content'
      };
      repo.save(updatedDoc);
      await db.commit();

      const result = await repo.getDocument(doc1.id);
      expect(result).toEqual(updatedDoc);
    });
  });
});