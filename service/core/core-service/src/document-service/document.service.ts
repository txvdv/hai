import { createUUID } from '@hai/common-utils';
import { failure, Result, success, UnitOfWork } from '../app.types.js';
import { DocumentRepository } from './document.repository.js';
import {
  ComposedDocument,
  CreateDocumentPayload,
  DeleteDocumentPayload,
  GetDocumentPayload,
  UpdateDocumentPayload,
} from './document.api.js';

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

  async getDocument(
    qry: GetDocumentPayload
  ): Promise<Result<Document, string>> {
    const doc = await this.documentRepository.getDocument(qry.id);
    if (!doc) {
      return failure(`Document with id ${qry.id} does not exist`);
    }
    return success(doc);
  }

  async getDocuments(): Promise<Result<ComposedDocument[]>> {
    const docs = await this.documentRepository.getDocuments();
    return success(docs);
  }

  async createDocument(
    cmd: CreateDocumentPayload
  ): Promise<Result<ComposedDocument>> {
    this.uow.start();
    const document = {
      id: createUUID(),
      content: cmd.content,
    };
    this.documentRepository.save(document);
    await this.uow.commit();
    return success(document);
  }

  async updateDocument(cmd: UpdateDocumentPayload): Promise<Result<void>> {
    const document = await this.documentRepository.getDocument(cmd.id);
    if (document) {
      this.uow.start();
      document.content = cmd.content;
      this.documentRepository.save(document);
      await this.uow.commit();
    }
    return success(undefined);
  }

  async deleteDocument(cmd: DeleteDocumentPayload): Promise<Result<void>> {
    this.uow.start();
    this.documentRepository.deleteDocument(cmd.id);
    await this.uow.commit();
    return success(undefined);
  }
}
