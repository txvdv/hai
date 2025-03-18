import { DocumentService } from './document-service.js';
import { InMemoryDocumentRepository } from './in-memory-document-repository.js';

const uow = {
  start: jest.fn(),
  commit: jest.fn().mockResolvedValueOnce(undefined),
};

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(() => {
    const documentRepository = new InMemoryDocumentRepository();
    service = new DocumentService({
      documentRepository,
      uow,
    });
  });

  describe('getDocument', () => {
    it('should return a document by its ID', async () => {
      const document = await service.createDocument({
        content: 'Sample Document',
      });
      const fetchedDocument = await service.getDocument({ id: document.id });

      expect(fetchedDocument).toEqual(document);
    });

    it('should return undefined if document does not exist', async () => {
      const fetchedDocument = await service.getDocument({
        id: 'non-existent-id',
      });

      expect(fetchedDocument).toBeNull();
    });
  });

  describe('getDocuments', () => {
    it('should return all documents', async () => {
      const doc1 = await service.createDocument({ content: 'Content 1' });
      const doc2 = await service.createDocument({ content: 'Content 2' });

      const documents = await service.getDocuments();

      expect(documents).toEqual([doc1, doc2]);
    });

    it('should return an empty array if no documents are present', async () => {
      const documents = await service.getDocuments();

      expect(documents).toEqual([]);
    });
  });

  describe('createDocument', () => {
    it('should create and return a new document', async () => {
      const content = 'New Document Content';
      const document = await service.createDocument({ content });

      expect(document).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          content,
        })
      );
    });
  });

  describe('updateDocument', () => {
    it('should update the content of an existing document', async () => {
      const document = await service.createDocument({
        content: 'Initial Content',
      });
      await service.updateDocument({
        id: document.id,
        content: 'Updated Content',
      });

      const updatedDocument = await service.getDocument({ id: document.id });

      expect(updatedDocument?.content).toBe('Updated Content');
    });

    it('should do nothing if the document does not exist', async () => {
      await service.updateDocument({
        id: 'non-existent-id',
        content: 'New Content',
      });

      const documents = await service.getDocuments();
      expect(documents).toEqual([]);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document by its ID', async () => {
      const document = await service.createDocument({
        content: 'Content to delete',
      });
      await service.deleteDocument({ id: document.id });

      const deletedDocument = await service.getDocument({ id: document.id });
      expect(deletedDocument).toBeNull();

      const documents = await service.getDocuments();
      expect(documents).toEqual([]);
    });

    it('should do nothing if the document does not exist', async () => {
      const doc1 = await service.createDocument({ content: 'Existing Doc' });
      await service.deleteDocument({ id: 'non-existent-id' });

      const documents = await service.getDocuments();
      expect(documents).toEqual([doc1]);
    });
  });
});
