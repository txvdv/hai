import {
  DxDatabase,
  DxDocumentRepository,
  DxUserRepository,
  UnitOfWork,
} from '@hai/service-infra';
import {
  DocumentRepository,
  MessageDispatcher,
  SimpleMessageDispatcher,
  UserRepository,
} from '@hai/core-service';
import { Application } from '@hai/core-service';
import { DocumentsController } from './documents/document.controller.js';
import {
  createResponseMessage,
  RequestMessageEnvelope,
  ResponseMessageEnvelope,
} from './messaging-infra/index.js';

export function getAppService(): AppService {
  return AppServiceImpl.getInstance();
}

export interface AppService {
  handleMessageAsync(msg: RequestMessageEnvelope<any>): Promise<any>;

  startup(): Promise<void>;

  teardown(): Promise<void>;
}

interface AppServiceConfig {
  // Add configurable options here
}

class AppServiceImpl implements AppService {
  private static instance: AppServiceImpl | null = null;
  private started: boolean = false;

  private readonly db: DxDatabase;
  private readonly uow: UnitOfWork;
  private readonly documentsController: DocumentsController;
  private readonly documentRepository: DocumentRepository;
  private readonly userRepository: UserRepository;
  private readonly messageDispatcher: MessageDispatcher;

  private constructor(config: AppServiceConfig = {}) {
    this.db = new DxDatabase();
    this.uow = new UnitOfWork(this.db);
    this.documentRepository = new DxDocumentRepository(this.db);
    this.userRepository = new DxUserRepository(this.db);

    this.messageDispatcher = new SimpleMessageDispatcher();

    new Application({
      documentRepository: this.documentRepository,
      userRepository: this.userRepository,
      messageDispatcher: this.messageDispatcher,
      unitOfWork: this.uow,
    });

    this.documentsController = new DocumentsController(this.messageDispatcher);
  }

  public static getInstance(config: AppServiceConfig = {}): AppServiceImpl {
    if (this.instance === null) {
      this.instance = new AppServiceImpl(config);
    }
    return this.instance;
  }

  async handleMessageAsync(
    msg: RequestMessageEnvelope<any>
  ): Promise<ResponseMessageEnvelope> {
    if (!this.started) {
      throw new Error('AppService not started.');
    }

    if (msg.metadata.messagePath && msg.metadata.messagePath === '/documents') {
      return this.documentsController.handle(msg);
    }

    return createResponseMessage(msg, 'error', {
      type: '/errors/unknown-message',
      title: 'Unknown Message',
      detail: 'Unknown Message',
    });
  }

  async startup(): Promise<void> {
    this.started = true;
    console.log('Service started');
  }

  async teardown(): Promise<void> {
    this.started = false;

    AppServiceImpl.instance = null;
    console.log('Service has been torn down and instance reset.');
  }
}
