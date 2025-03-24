import { MessageBus } from './shared/messaging.js';
import { UnitOfWork } from './shared/unit-of-work.js';
import { DocumentService } from './document-service/document.service.js';
import { DocumentRepository } from './document-service/document.repository.js';
import {
  CreateDocument,
  CreateDocumentPayload,
  DeleteDocument,
  DeleteDocumentPayload,
  GetDocument,
  GetDocumentPayload,
  ListDocuments,
} from './document-service/document.api.js';
import { LocalUserAccountRepository } from './local-user-account/local-user-account.repository.js';
import { LocalUserAccountService } from './local-user-account/local-user-account.service.js';
import {
  CreateLocalUserAccount,
  DeleteLocalUserAccount,
  GetLocalUserAccount,
} from './local-user-account/local-user-account.api.js';

interface ApplicationDependencies {
  messageBus: MessageBus;
  unitOfWork: UnitOfWork;
  documentRepository: DocumentRepository;
  localUserAccountRepository: LocalUserAccountRepository;
}

export class Application {
  private messageBus: MessageBus;
  private unitOfWork: UnitOfWork;
  private documentRepository: DocumentRepository;
  private documentService: DocumentService;
  private localUserAccountRepository: LocalUserAccountRepository;
  private localUserAccountService: LocalUserAccountService;

  constructor(dependencies: ApplicationDependencies) {
    this.messageBus = dependencies.messageBus;
    this.unitOfWork = dependencies.unitOfWork;

    this.documentRepository = dependencies.documentRepository;
    this.documentService = new DocumentService({
      documentRepository: this.documentRepository,
      uow: this.unitOfWork,
    });

    this.localUserAccountRepository = dependencies.localUserAccountRepository;
    this.localUserAccountService = new LocalUserAccountService({
      localUserAccountRepository: this.localUserAccountRepository,
      uow: this.unitOfWork,
    });

    this.registerDocumentHandlers();
    this.registerLocalUserAccountHandlers();
  }

  private registerDocumentHandlers() {
    this.messageBus.registerCommand(
      CreateDocument,
      async (cmd: CreateDocumentPayload) => {
        return this.documentService.createDocument(cmd);
      }
    );

    this.messageBus.registerCommand(
      DeleteDocument,
      async (cmd: DeleteDocumentPayload) => {
        return this.documentService.deleteDocument(cmd);
      }
    );

    this.messageBus.registerQuery(
      GetDocument,
      async (qry: GetDocumentPayload) => {
        return this.documentService.getDocument(qry);
      }
    );

    this.messageBus.registerQuery(ListDocuments, async () => {
      return this.documentService.getDocuments();
    });
  }

  private registerLocalUserAccountHandlers() {
    this.messageBus.registerCommand(CreateLocalUserAccount, async () => {
      return this.localUserAccountService.createAccount();
    });

    this.messageBus.registerCommand(DeleteLocalUserAccount, async () => {
      return this.localUserAccountService.deleteAccount();
    });

    this.messageBus.registerQuery(GetLocalUserAccount, async () => {
      return this.localUserAccountService.getAccount();
    });
  }
}
