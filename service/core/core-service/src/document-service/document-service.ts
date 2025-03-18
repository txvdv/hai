import { createUUID } from '@hai/common-utils';
import { UnitOfWork } from '../app.types.js';
import { DocumentRepository } from './document-repository.js';
import {
  CreateDocumentPayload,
  DeleteDocumentPayload,
  GetDocumentPayload,
  UpdateDocumentPayload,
} from './document.types.js';

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

  async getDocument(qry: GetDocumentPayload) {
    return this.documentRepository.getDocument(qry.id);
  }

  async getDocuments() {
    return this.documentRepository.getDocuments();
  }

  async createDocument(cmd: CreateDocumentPayload) {
    this.uow.start();
    const document = {
      id: createUUID(),
      content: cmd.content,
    };
    this.documentRepository.save(document);
    await this.uow.commit();
    return document;
  }

  async updateDocument(cmd: UpdateDocumentPayload) {
    const document = await this.documentRepository.getDocument(cmd.id);
    if (document) {
      this.uow.start();
      document.content = cmd.content;
      this.documentRepository.save(document);
      await this.uow.commit();
    }
  }

  async deleteDocument(cmd: DeleteDocumentPayload) {
    this.uow.start();
    this.documentRepository.deleteDocument(cmd.id);
    await this.uow.commit();
  }
}
