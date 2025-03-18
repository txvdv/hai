import { MessageBus } from './message-bus.js';
import { UnitOfWork } from './app.types.js';
import { DocumentService } from './document-service/document-service.js';
import { DocumentRepository } from './document-service/document-repository.js';

interface ApplicationDependencies {
  messageBus: MessageBus;
  unitOfWork: UnitOfWork;
  documentRepository: DocumentRepository;
}

export class Application {
  private messageBus: MessageBus;
  private unitOfWork: UnitOfWork;
  private documentRepository: DocumentRepository;
  private documentService: DocumentService;

  constructor(dependencies: ApplicationDependencies) {
    this.messageBus = dependencies.messageBus;
    this.unitOfWork = dependencies.unitOfWork;
    this.documentRepository = dependencies.documentRepository;

    this.documentService = new DocumentService({
      documentRepository: this.documentRepository,
      uow: this.unitOfWork,
    });

    this.registerDocumentHandlers();
  }

  private registerDocumentHandlers() {
    this.messageBus.registerCommand(
      'CREATE_DOCUMENT',
      async (cmd: { content: string }) => {
        return this.documentService.createDocument(cmd);
      }
    );

    this.messageBus.registerQuery(
      'GET_DOCUMENT',
      async (qry: { id: string }) => {
        return this.documentService.getDocument(qry);
      }
    );
  }
}
