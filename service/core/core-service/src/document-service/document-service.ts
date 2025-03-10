import { createUUID } from '@hai/common-utils';
import { UnitOfWork } from '../app.types.js';

export type Document = {
  id: string
  content: string
};

export class DocumentService {
  private documentRepository: DocumentRepository;
  private uow: UnitOfWork;

  constructor(deps: {
    documentRepository: DocumentRepository
    uow: UnitOfWork
  }) {
    this.documentRepository = deps.documentRepository;
    this.uow = deps.uow;
  }

  async getDocument(id: string) {
    return this.documentRepository.getDocument(id);
  }

  async getDocuments() {
    return this.documentRepository.getDocuments();
  }

  async createDocument(content: string) {
    this.uow.start();
    const document = {
      id: createUUID(),
      content
    };
    this.documentRepository.save(document);
    await this.uow.commit();
    return document;
  }

  async updateDocument(id: string, content: string) {
    const document = await this.documentRepository.getDocument(id)
    if (document) {
      this.uow.start();
      document.content = content;
      this.documentRepository.save(document);
      await this.uow.commit();
    }
  }

  async deleteDocument(id: string) {
    this.uow.start();
    this.documentRepository.deleteDocument(id);
    await this.uow.commit();
  }
}

export interface DocumentRepository {
  getDocument(id: string): Promise<Document | null>;

  getDocuments(): Promise<Document[]>;

  save(doc: Document): void;

  deleteDocument(id: string): void;
}

export class InMemoryDocumentRepository implements DocumentRepository {
  documents: Document[] = [];

  async getDocument(id: string) {
    const doc = this.documents.find(doc => doc.id === id);
    if (!doc) return null;
    return doc;
  }

  async getDocuments() {
    return this.documents;
  }

  save(doc: Document) {
    const existingIndex = this.documents.findIndex(existingDoc => existingDoc.id === doc.id);
    if (existingIndex !== -1) {
      this.documents[existingIndex] = doc;
    } else {
      this.documents.push(doc);
    }
  }

  deleteDocument(id: string) {
    this.documents = this.documents.filter(doc => doc.id !== id);
  }
}