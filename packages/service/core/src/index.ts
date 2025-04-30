export { Application } from './application.js';
export type { UnitOfWork } from './shared/unit-of-work.js';

// -------------------------------------------------------------------------
// Driven ports
// -------------------------------------------------------------------------
// Document
export type { DocumentRepository } from './domain/Document/DocumentRepository.js';
export { Document } from './domain/Document/Document.js';
export { DocumentID } from './domain/Document/DocumentID.js';

// User
export { User } from './domain/User/User.js';
export { UserID } from './domain/User/UserID.js';
export type { UserRepository } from './domain/User/UserRepository.js';

// -------------------------------------------------------------------------
// Driver ports
// -------------------------------------------------------------------------
// Messaging
export type {
  MessageBus,
  Result,
  CQMessage,
  Command,
  Query,
} from './shared/messaging.js';
export { InMemoryMessageBus } from './shared/messaging.js';
export type { MessageDispatcher } from './application/Messaging/messaging.interface.js';
export { SimpleMessageDispatcher } from './infra/messaging/SimpleMessageDispatcher.js';

// Document
export { CreateDocumentCommand } from './application/Document/CreateDocumentCommand.js';
export type { CreateDocumentResult } from './application/Document/CreateDocumentCommand.js';
export type { DocumentDTO } from './application/Document/DocumentDTO.js';
export { DeleteDocumentCommand } from './application/Document/DeleteDocumentCommand.js';
export { GetDocumentQuery } from './application/Document/GetDocumentQuery.js';
export { GetDocumentsQuery } from './application/Document/GetDocumentsQuery.js';
export { UpdateDocumentCommand } from './application/Document/UpdateDocumentCommand.js';

// User
export { CreateUser } from './application/User/CreateUser.js';

// Shared
export { EntityNotFoundError } from './shared/errors.js';
