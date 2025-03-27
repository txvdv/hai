export { Application } from './application.js';
export type { UnitOfWork } from './shared/unit-of-work.js';

// Driven ports
export type { DocumentRepository } from './document-service/document.repository.js';
export { LocalUserAccount } from './local-user-account/local-user-account.js';
export type { LocalUserAccountRepository } from './local-user-account/local-user-account.repository.js';

// Driver ports
export type {
  MessageBus,
  Result,
  CQMessage,
  Command,
  Query,
} from './shared/messaging.js';
export { InMemoryMessageBus } from './shared/messaging.js';

export type {
  CreateDocument,
  CreateDocumentResult,
  DeleteDocument,
  DeleteDocumentResult,
  GetDocument,
  GetDocumentResult,
  ListDocuments,
  ListDocumentsResult,
  UpdateDocument,
  UpdateDocumentResult,
  ComposedDocument,
} from './document-service/document.api.js';
export type { Document } from './document-service/document.service.js';
export { DocumentService } from './document-service/document.service.js';

export type {
  CreateLocalUserAccount,
  CreateLocalUserAccountResult,
  DeleteLocalUserAccount,
  DeleteLocalUserAccountResult,
  GetLocalUserAccount,
  GetLocalUserAccountResult,
  UpdateLocalUserAccount,
} from './local-user-account/local-user-account.api.js';
export { LocalUserAccountAlreadyExistsError } from './local-user-account/local-user-account.api.js';

export { EntityNotFoundError } from './shared/errors.js';
