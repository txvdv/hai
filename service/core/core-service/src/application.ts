import { MessageBus } from './message-bus.js';
import { UnitOfWork } from './app.types.js';
import {
  DocumentRepository,
  DocumentService,
} from './document-service/document-service.js';

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

    // Register message handlers for application-level use cases
    this.registerHandlers();
  }

  private registerHandlers() {
    this.messageBus.registerCommand(
      'CREATE_DOCUMENT',
      async (content: string) => {
        return this.createDocument(content);
      }
    );
  }

  private async createDocument(content: string) {
    return this.documentService.createDocument(content);
  }
}
