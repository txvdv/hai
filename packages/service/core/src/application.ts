import { MessageDispatcher } from './application/Messaging/messaging.interface.js';
import { UnitOfWork } from './shared/unit-of-work.js';
import { DocumentRepository } from './domain/Document/DocumentRepository.js';
import { UserRepository } from './domain/User/UserRepository.js';
import { registerUserHandlers } from './application/User/index.js';
import { registerDocumentHandlers } from './application/Document/index.js';

interface ApplicationDependencies {
  documentRepository: DocumentRepository;
  messageDispatcher: MessageDispatcher;
  unitOfWork: UnitOfWork;
  userRepository: UserRepository;
}

export class Application {
  private messageDispatcher: MessageDispatcher;
  private unitOfWork: UnitOfWork;
  private userRepository: UserRepository;

  constructor(deps: ApplicationDependencies) {
    this.messageDispatcher = deps.messageDispatcher;
    this.unitOfWork = deps.unitOfWork;
    this.userRepository = deps.userRepository;

    registerDocumentHandlers({
      messageDispatcher: this.messageDispatcher,
      uow: this.unitOfWork,
      documentRepository: deps.documentRepository,
    });

    registerUserHandlers({
      messageDispatcher: this.messageDispatcher,
      uow: this.unitOfWork,
      userRepository: this.userRepository,
    });
  }
}
