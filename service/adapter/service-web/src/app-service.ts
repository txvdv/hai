import { buildMessageResponse } from './app-messaging.js';
import { MessageEnvelope, MessageResponse } from './app-messaging.js';
import {
  DxDatabase,
  DxDocumentRepository,
  DxLocalUserAccountRepository,
  UnitOfWork,
} from '@hai/service-infra';
import { LocalUserAccountRepository } from '@hai/core-service';
import { Application, InMemoryMessageBus, MessageBus } from '@hai/core-service';
import { DocumentController } from './document.controller.js';

export function getAppService(): AppService {
  return AppServiceImpl.getInstance();
}

export interface AppService {
  handleMessage(msg: MessageEnvelope): void;

  handleMessageAsync(msg: MessageEnvelope): Promise<any>;

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
  private readonly documentMessageController: DocumentController;
  private readonly documentRepository: DxDocumentRepository;
  private readonly localUserAccountRepository: LocalUserAccountRepository;
  private readonly messageBus: MessageBus;

  private constructor(config: AppServiceConfig = {}) {
    this.db = new DxDatabase();
    this.uow = new UnitOfWork(this.db);
    this.documentRepository = new DxDocumentRepository(this.db);
    this.documentRepository = new DxDocumentRepository(this.db);
    this.localUserAccountRepository = new DxLocalUserAccountRepository(this.db);
    this.messageBus = new InMemoryMessageBus();
    this.documentMessageController = new DocumentController(this.messageBus);
    new Application({
      documentRepository: this.documentRepository,
      localUserAccountRepository: this.localUserAccountRepository,
      messageBus: this.messageBus,
      unitOfWork: this.uow,
    });
  }

  public static getInstance(config: AppServiceConfig = {}): AppServiceImpl {
    if (this.instance === null) {
      this.instance = new AppServiceImpl(config);
    }
    return this.instance;
  }

  handleMessage(msg: MessageEnvelope): void {
    if (!this.started) {
      throw new Error('AppService not started.');
    }
  }

  async handleMessageAsync(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    if (!this.started) {
      throw new Error('AppService not started.');
    }

    if (msg.type.startsWith('Document')) {
      return await this.documentMessageController.handle(msg);
    }

    return buildMessageResponse(`${msg.type}.Response`, 'error', {
      payload: {
        title: 'Unhandled Type',
        detail: 'No controller found for this type.',
      },
      correlationId: msg.metadata.correlationId,
    });
  }

  async startup(): Promise<void> {
    this.started = true;
    console.log('Service started');
  }

  async teardown(): Promise<void> {
    this.started = false;

    // Reset singleton instance to allow new configuration
    AppServiceImpl.instance = null;
    console.log('Service has been torn down and instance reset.');
  }
}

/**
 * Ping Pong
 */
export type PingMessage = MessageEnvelope<string> & {
  type: 'App.Ping';
};

export type PingResponseMessage = MessageResponse<string> & {
  type: 'App.Pong';
};
