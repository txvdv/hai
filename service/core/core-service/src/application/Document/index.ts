import { MessageDispatcher } from '../Messaging/messaging.interface.js';
import { UnitOfWork } from '../../shared/unit-of-work.js';
import { DocumentHandler } from './DocumentHandler.js';
import { DocumentRepository } from '../../domain/Document/DocumentRepository.js';

export function registerDocumentHandlers(deps: {
  messageDispatcher: MessageDispatcher;
  documentRepository: DocumentRepository;
  uow: UnitOfWork;
}) {
  const { messageDispatcher, documentRepository, uow } = deps;

  const documentHandler = new DocumentHandler({
    documentRepository,
    uow,
  });

  messageDispatcher.register('CreateDocumentCommand', documentHandler);
  messageDispatcher.register('DeleteDocumentCommand', documentHandler);
  messageDispatcher.register('GetDocumentQuery', documentHandler);
  messageDispatcher.register('GetDocumentsQuery', documentHandler);
  messageDispatcher.register('UpdateDocumentCommand', documentHandler);
}
