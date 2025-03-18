import { createUUID } from '@hai/common-utils';
import { UnitOfWork } from '../app.types.js';
import { DocumentRepository } from './document-repository.js';

export type Document = {
  id: string;
  content: string;
};

export class DocumentService {
  private documentRepository: DocumentRepository;
  private uow: UnitOfWork;

  constructor(deps: {
    documentRepository: DocumentRepository;
    uow: UnitOfWork;
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
      content,
    };
    this.documentRepository.save(document);
    await this.uow.commit();
    return document;
  }

  async updateDocument(id: string, content: string) {
    const document = await this.documentRepository.getDocument(id);
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
