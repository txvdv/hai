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
      const document = await service.createDocument('Sample Document');
      const fetchedDocument = await service.getDocument(document.id);

      expect(fetchedDocument).toEqual(document);
    });

    it('should return undefined if document does not exist', async () => {
      const fetchedDocument = await service.getDocument('non-existent-id');

      expect(fetchedDocument).toBeNull();
    });
  });

  describe('getDocuments', () => {
    it('should return all documents', async () => {
      const doc1 = await service.createDocument('Content 1');
      const doc2 = await service.createDocument('Content 2');

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
      const document = await service.createDocument(content);

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
      const document = await service.createDocument('Initial Content');
      await service.updateDocument(document.id, 'Updated Content');

      const updatedDocument = await service.getDocument(document.id);

      expect(updatedDocument?.content).toBe('Updated Content');
    });

    it('should do nothing if the document does not exist', async () => {
      await service.updateDocument('non-existent-id', 'New Content');

      const documents = await service.getDocuments();
      expect(documents).toEqual([]);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document by its ID', async () => {
      const document = await service.createDocument('Content to delete');
      await service.deleteDocument(document.id);

      const deletedDocument = await service.getDocument(document.id);
      expect(deletedDocument).toBeNull();

      const documents = await service.getDocuments();
      expect(documents).toEqual([]);
    });

    it('should do nothing if the document does not exist', async () => {
      const doc1 = await service.createDocument('Existing Doc');
      await service.deleteDocument('non-existent-id');

      const documents = await service.getDocuments();
      expect(documents).toEqual([doc1]);
    });
  });
});
