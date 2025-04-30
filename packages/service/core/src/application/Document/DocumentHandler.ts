import { createUUID } from '@hai/common-utils';
import {
  MessageHandler,
  Result,
  success,
} from '../Messaging/messaging.interface.js';
import {
  CreateDocumentCommand,
  CreateDocumentResult,
} from './CreateDocumentCommand.js';
import { DeleteDocumentCommand } from './DeleteDocumentCommand.js';
import { GetDocumentQuery } from './GetDocumentQuery.js';
import { GetDocumentsQuery } from './GetDocumentsQuery.js';
import { UpdateDocumentCommand } from './UpdateDocumentCommand.js';
import { UnitOfWork } from '../../shared/unit-of-work.js';
import { Document } from '../../domain/Document/Document.js';
import { DocumentID } from '../../domain/Document/DocumentID.js';
import { DocumentRepository } from '../../domain/Document/DocumentRepository.js';
import { DocumentDTO, mapToDTO } from './DocumentDTO.js';

type DocumentMessages =
  | CreateDocumentCommand
  | DeleteDocumentCommand
  | GetDocumentQuery
  | GetDocumentsQuery
  | UpdateDocumentCommand;

export class DocumentHandler implements MessageHandler<DocumentMessages, any> {
  private readonly documentRepository: DocumentRepository;
  private uow: UnitOfWork;

  constructor(deps: {
    documentRepository: DocumentRepository;
    uow: UnitOfWork;
  }) {
    this.documentRepository = deps.documentRepository;
    this.uow = deps.uow;
  }

  handle(msg: DocumentMessages): Promise<any> {
    switch (msg.type) {
      case 'CreateDocumentCommand':
        return this.handleCreateDocument(msg as CreateDocumentCommand);
      case 'DeleteDocumentCommand':
        return this.handleDeleteDocument(msg as DeleteDocumentCommand);
      case 'GetDocumentQuery':
        return this.handleGetDocument(msg as GetDocumentQuery);
      case 'GetDocumentsQuery':
        return this.handleGetDocuments(msg as GetDocumentsQuery);
      case 'UpdateDocumentCommand':
        return this.handleUpdateDocument(msg as UpdateDocumentCommand);
      default:
        return Promise.reject(
          new Error(`Unknown message type: ${(msg as any).type}`)
        );
    }
  }

  private async handleCreateDocument(
    msg: CreateDocumentCommand
  ): Promise<CreateDocumentResult> {
    const document = Document.create({
      id: DocumentID.of(createUUID()),
      content: msg.content,
    });

    this.uow.start();
    this.documentRepository.save(document);
    await this.uow.commit();

    return success({
      id: document.getId().toString(),
    });
  }

  private async handleDeleteDocument(
    msg: DeleteDocumentCommand
  ): Promise<Result<void>> {
    this.uow.start();
    this.documentRepository.deleteDocument(DocumentID.of(msg.id));
    await this.uow.commit();

    return success(undefined);
  }

  private async handleGetDocument(
    msg: GetDocumentQuery
  ): Promise<Result<DocumentDTO>> {
    const document = await this.documentRepository.load(DocumentID.of(msg.id));
    return success(mapToDTO(document));
  }

  private async handleGetDocuments(
    _: GetDocumentsQuery
  ): Promise<Result<DocumentDTO[]>> {
    const documents = await this.documentRepository.getDocuments({
      orderBy: 'date',
      orderDirection: 'desc',
    });
    return success(documents.map(mapToDTO));
  }

  private async handleUpdateDocument(
    msg: UpdateDocumentCommand
  ): Promise<Result<void>> {
    const document = await this.documentRepository.load(DocumentID.of(msg.id));

    document.update({ content: msg.content });

    this.uow.start();
    this.documentRepository.save(document);
    await this.uow.commit();

    return success(undefined);
  }
}
