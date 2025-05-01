import 'fake-indexeddb/auto';
import { Document, DocumentID } from '@hai/service-core';
import { DxDatabase } from './database.js';
import { DxDocumentRepository } from './DxDocumentRepository.js';
import { UnitOfWork } from './unit-of-work.js';

describe('DxDocumentRepository', () => {
  let db: DxDatabase;
  let uow: UnitOfWork;
  let repository: DxDocumentRepository;

  beforeEach(() => {
    db = new DxDatabase();
    uow = new UnitOfWork(db);
    repository = new DxDocumentRepository(db);
  });

  afterEach(async () => {
    await db.deleteDb();
  });

  describe('clear', () => {
    it('should clear the documents from the database', async () => {
      const document = Document.createFromState({
        id: 'doc-1',
        content: 'Test content',
      });

      uow.start();
      repository.save(document);
      await uow.commit();

      uow.start();
      repository.clear();
      await uow.commit();

      const documents = await db.documents.toArray();
      expect(documents).toHaveLength(0);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document by ID', async () => {
      const document = Document.createFromState({
        id: 'doc-1',
        content: 'Test content',
      });

      uow.start();
      repository.save(document);
      await uow.commit();

      uow.start();
      repository.deleteDocument(DocumentID.fromString('doc-1'));
      await uow.commit();

      const documents = await db.documents.toArray();
      expect(documents).toHaveLength(0);
    });
  });

  describe('findDocuments', () => {
    it('should retrieve all documents', async () => {
      const document1 = Document.createFromState({
        id: 'doc-1',
        content: 'Content 1',
      });
      const document2 = Document.createFromState({
        id: 'doc-2',
        content: 'Content 2',
      });

      uow.start();
      repository.save(document1);
      repository.save(document2);
      await uow.commit();

      const documents = await repository.findDocuments();
      expect(documents).toHaveLength(2);
    });
  });

  describe('findLatestDocument', () => {
    it('should retrieve the latest document if one exists', async () => {
      const document = Document.createFromState({
        id: 'doc-1',
        content: 'Latest content',
      });

      uow.start();
      repository.save(document);
      await uow.commit();

      const latestDocument = await repository.findLatestDocument();
      expect(latestDocument).toBeDefined();
      expect(latestDocument?.getState().id).toBe('doc-1');
    });

    it('should return null if no documents exist', async () => {
      const latestDocument = await repository.findLatestDocument();
      expect(latestDocument).toBeNull();
    });
  });

  describe('getDocuments', () => {
    it('should retrieve all documents in the database', async () => {
      const document1 = Document.createFromState({
        id: 'doc-1',
        content: 'Content 1',
      });
      const document2 = Document.createFromState({
        id: 'doc-2',
        content: 'Content 2',
      });

      uow.start();
      repository.save(document1);
      repository.save(document2);
      await uow.commit();

      const documents = await repository.getDocuments();
      expect(documents).toHaveLength(2);
    });
  });

  describe('load', () => {
    it('should load a document by its ID', async () => {
      const document = Document.createFromState({
        id: 'doc-1',
        content: 'Test content',
      });

      uow.start();
      repository.save(document);
      await uow.commit();

      const loadedDocument = await repository.load(
        DocumentID.fromString('doc-1')
      );

      expect(loadedDocument.getState().id).toBe('doc-1');
    });

    it('should throw an error if the document is not found', async () => {
      await expect(
        repository.load(DocumentID.fromString('non-existent-id'))
      ).rejects.toThrow('Document not found');
    });
  });

  describe('save', () => {
    it('should save a document to the database', async () => {
      const document = Document.createFromState({
        id: 'doc-1',
        content: 'Test content',
      });

      uow.start();
      repository.save(document);
      await uow.commit();

      const documents = await db.documents.toArray();

      expect(documents).toHaveLength(1);
      expect(documents[0].id).toBe('doc-1');
    });
  });
});
