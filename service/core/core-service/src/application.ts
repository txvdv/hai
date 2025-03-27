import { MessageBus } from './shared/messaging.js';
import { UnitOfWork } from './shared/unit-of-work.js';
import { DocumentService } from './document-service/document.service.js';
import { DocumentRepository } from './document-service/document.repository.js';
import {
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
} from './document-service/document.api.js';
import { LocalUserAccountRepository } from './local-user-account/local-user-account.repository.js';
import { LocalUserAccountService } from './local-user-account/local-user-account.service.js';
import {
  CreateLocalUserAccount,
  CreateLocalUserAccountResult,
  DeleteLocalUserAccount,
  DeleteLocalUserAccountResult,
  GetLocalUserAccount,
  GetLocalUserAccountResult,
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
    this.messageBus.registerSaw<CreateDocument, CreateDocumentResult>(
      'CreateDocumentCommand',
      async (cmd: CreateDocument) => {
        return this.documentService.createDocument(cmd);
      }
    );

    this.messageBus.registerSaw<DeleteDocument, DeleteDocumentResult>(
      'DeleteDocumentCommand',
      async (cmd: DeleteDocument) => {
        return this.documentService.deleteDocument(cmd);
      }
    );

    this.messageBus.registerSaw<UpdateDocument, UpdateDocumentResult>(
      'UpdateDocumentCommand',
      async (cmd: UpdateDocument) => {
        return this.documentService.updateDocument(cmd);
      }
    );

    this.messageBus.registerSaw<GetDocument, GetDocumentResult>(
      'GetDocumentQuery',
      async (qry: GetDocument) => {
        return this.documentService.getDocument(qry);
      }
    );

    this.messageBus.registerSaw<ListDocuments, ListDocumentsResult>(
      'ListDocumentsQuery',
      async () => {
        return this.documentService.getDocuments();
      }
    );
  }

  private registerLocalUserAccountHandlers() {
    this.messageBus.registerSaw<
      CreateLocalUserAccount,
      CreateLocalUserAccountResult
    >('CreateLocalUserAccount', async () => {
      return this.localUserAccountService.createAccount();
    });

    this.messageBus.registerSaw<
      DeleteLocalUserAccount,
      DeleteLocalUserAccountResult
    >('DeleteLocalUserAccount', async () => {
      return this.localUserAccountService.deleteAccount();
    });

    this.messageBus.registerSaw<GetLocalUserAccount, GetLocalUserAccountResult>(
      'GetLocalUserAccount',
      async () => {
        return this.localUserAccountService.getAccount();
      }
    );
  }
}
