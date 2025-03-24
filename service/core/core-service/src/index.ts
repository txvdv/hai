export { Application } from './application.js';
export * from './app.types.js';

// Driven ports
export type { DocumentRepository } from './document-service/document.repository.js';
export { InMemoryDocumentRepository } from './document-service/in-memory-document-repository.js';
export { LocalUserAccount } from './local-user-account/local-user-account.js';
export type { LocalUserAccountRepository } from './local-user-account/local-user-account.repository.js';

// Driver ports
export type { MessageBus } from './message-bus.js';
export { InMemoryMessageBus } from './message-bus.js';

export {
  CreateDocument,
  DeleteDocument,
  GetDocument,
  ListDocuments,
  UpdateDocument,
} from './document-service/document.api.js';
export type {
  CreateDocumentPayload,
  DeleteDocumentPayload,
  UpdateDocumentPayload,
  ComposedDocument,
} from './document-service/document.api.js';
export type { Document } from './document-service/document.service.js';
export { DocumentService } from './document-service/document.service.js';

export {
  CreateLocalUserAccount,
  DeleteLocalUserAccount,
  GetLocalUserAccount,
  UpdateLocalUserAccount,
  LocalUserAccountAlreadyExistsError,
} from './local-user-account/local-user-account.api.js';

export { EntityNotFoundError } from './shared/entity-not-found-error.js';
