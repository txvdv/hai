import { createUUID } from '@hai/common-utils';
import { UnitOfWork } from '../shared/unit-of-work.js';
import { DocumentRepository } from './document.repository.js';
import {
  ComposedDocument,
  CreateDocument,
  DeleteDocument,
  GetDocument,
  UpdateDocument,
} from './document.api.js';
import { failure, Result, success } from '../shared/messaging.js';

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

  async createDocument(cmd: CreateDocument): Promise<Result<ComposedDocument>> {
    this.uow.start();
    const document = {
      id: createUUID(),
      content: cmd.payload.content,
    };
    this.documentRepository.save(document);
    await this.uow.commit();
    return success(document);
  }

  async deleteDocument(cmd: DeleteDocument): Promise<Result<void>> {
    this.uow.start();
    this.documentRepository.deleteDocument(cmd.payload.id);
    await this.uow.commit();
    return success(undefined);
  }

  async getDocument(qry: GetDocument): Promise<Result<Document, string>> {
    const doc = await this.documentRepository.getDocument(qry.payload.id);
    if (!doc) {
      return failure(`Document with id ${qry.payload.id} does not exist`);
    }
    return success(doc);
  }

  async getDocuments(): Promise<Result<ComposedDocument[]>> {
    const docs = await this.documentRepository.getDocuments();
    return success(docs);
  }

  async updateDocument(cmd: UpdateDocument): Promise<Result<void>> {
    const document = await this.documentRepository.getDocument(cmd.payload.id);
    if (document) {
      this.uow.start();
      document.content = cmd.payload.content;
      this.documentRepository.save(document);
      await this.uow.commit();
    }
    return success(undefined);
  }
}
