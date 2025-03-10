import 'fake-indexeddb/auto';
import { DxDatabase, DxDocumentRepository, UnitOfWork } from './document-repository.js';
import { Document } from '@hai/service-core';
import { createUUID } from '@hai/shared-utils';

class DocumentBuilder {
  private document: Document = {
    id: createUUID(),
    content: ''
  };

  withContent(content: string): DocumentBuilder {
    this.document.content = content;
    return this;
  }

  build(): Document {
    return this.document;
  }
}

describe('DxDocumentRepository', () => {
  let db: DxDatabase;
  let uow: UnitOfWork;
  let repo: DxDocumentRepository;

  // Setup a new database instance before each test
  beforeEach(() => {
    db = new DxDatabase();
    uow = new UnitOfWork(db);
    repo = new DxDocumentRepository(db);
  });

  // Clear the database after each test
  afterEach(async () => {
    // Clear all data in the `documents` table
    await db.documents.clear();
  });

  it('should add a document and retrieve it from the database', async () => {
    // Create a new document using the builder
    const newDocument = new DocumentBuilder().withContent('Test document content').build();

    uow.start();
    // Add the document to the database
    repo.save(newDocument)
    await uow.commit(); // Commit the transaction

    // Retrieve the document from the database
    const retrievedDocument = await db.documents.get(newDocument.id);

    // Assertions
    expect(retrievedDocument).toBeDefined();
    expect(retrievedDocument?.id).toBe(newDocument.id);
    expect(retrievedDocument?.content).toBe(newDocument.content);
  });

  it('should delete a document from the database', async () => {
    // Create a new document using the builder
    const newDocument = new DocumentBuilder().withContent('Document to be deleted').build();

    // Add the document to the database
    const id = await db.documents.add(newDocument);

    // Verify the document exists before deletion
    let retrievedDocument = await db.documents.get(id);
    expect(retrievedDocument).toBeDefined();

    // Delete the document from the database
    await db.documents.delete(id);

    // Verify the document no longer exists
    retrievedDocument = await db.documents.get(id);
    expect(retrievedDocument).toBeUndefined();
  });

  it('should update a document in the database', async () => {
    // Create and add a new document
    const newDocument = new DocumentBuilder().withContent('Original content').build();
    const id = await db.documents.add(newDocument);

    // Update the document's content
    const updatedContent = 'Updated document content';
    await db.documents.update(id, { content: updatedContent });

    // Retrieve and verify the updated document
    const retrievedDocument = await db.documents.get(id);
    expect(retrievedDocument).toBeDefined();
    expect(retrievedDocument?.id).toBe(id);
    expect(retrievedDocument?.content).toBe(updatedContent);
  });

  it('should retrieve all documents from the database', async () => {
    // Create and add multiple documents
    const documents = [
      new DocumentBuilder().withContent('First document').build(),
      new DocumentBuilder().withContent('Second document').build(),
      new DocumentBuilder().withContent('Third document').build()
    ];

    for (const doc of documents) {
      await db.documents.add(doc);
    }

    // Retrieve all documents
    const retrievedDocuments = await db.documents.toArray();

    // Assertions
    expect(retrievedDocuments.length).toBe(documents.length);
    for (const doc of documents) {
      expect(retrievedDocuments).toContainEqual(expect.objectContaining(doc));
    }
  });
});