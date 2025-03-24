export { Application } from './application.js';
export type { UnitOfWork } from './shared/unit-of-work.js';

// Driven ports
export type { DocumentRepository } from './document-service/document.repository.js';
export { LocalUserAccount } from './local-user-account/local-user-account.js';
export type { LocalUserAccountRepository } from './local-user-account/local-user-account.repository.js';

// Driver ports
export type { MessageBus } from './shared/messaging.js';
export { InMemoryMessageBus } from './shared/messaging.js';

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

export { EntityNotFoundError } from './shared/errors.js';
