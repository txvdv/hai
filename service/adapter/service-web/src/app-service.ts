import { buildMessageResponse } from './app-messaging.js';
import { MessageEnvelope, MessageResponse } from './app-messaging.js';
import {
  DxDatabase,
  DxDocumentRepository,
  UnitOfWork,
} from '@hai/service-infra';
import { DocumentService } from '@hai/core-service';
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
  private readonly documentController: DocumentController;
  private readonly documentRepository: DxDocumentRepository;
  private readonly documentService: DocumentService;
  private readonly messageBus: MessageBus;

  private constructor(config: AppServiceConfig = {}) {
    this.db = new DxDatabase();
    this.uow = new UnitOfWork(this.db);
    this.documentRepository = new DxDocumentRepository(this.db);
    this.documentService = new DocumentService({
      documentRepository: this.documentRepository,
      uow: this.uow,
    });
    this.documentController = new DocumentController(this.documentService);
    this.messageBus = new InMemoryMessageBus();
    new Application({
      documentRepository: this.documentRepository,
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

  async handleMessageAsyncViaController(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    if (!this.started) {
      throw new Error('AppService not started.');
    }

    if (msg.type.startsWith('Document')) {
      return await this.documentController.handle(msg);
    }

    return buildMessageResponse(`${msg.type}.Response`, 'error', {
      payload: {
        title: 'Unhandled Type',
        detail: 'No controller found for this type.',
      },
      correlationId: msg.metadata.correlationId,
    });
  }

  async handleMessageAsync_(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    if (!this.started) {
      throw new Error('AppService not started.');
    }

    const { correlationId } = msg.metadata;
    if (!correlationId) {
      throw new Error('correlationId must be provided.');
    }

    try {
      const { type, payload } = msg;
      /**
       * if type starts with 'Document'
       * return documentController.handle(msg)
       */
      /**
       * Normally:
       * 1. validate incoming message
       * 2. map to command/query payload
       * 3. issue command/query
       * 4. map to response
       */
      const result = await this.messageBus.sendAndWait(type, payload);
      if (result.success) {
        return buildMessageResponse('Document.List.Response', 'success', {
          payload: { documents: result.value },
          correlationId,
        });
      } else {
        return buildMessageResponse('Document.List.Response', 'error', {
          payload: {
            title: 'Error',
            detail: result.error,
          },
          correlationId,
        });
      }
    } catch (e) {
      return buildMessageResponse('Document.List.Response', 'error', {
        payload: {
          title: 'Error',
          detail: 'Something went wrong.',
        },
        correlationId,
      });
    }
  }

  async handleMessageAsync(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    if (!this.started) {
      throw new Error('AppService not started.');
    }

    const { correlationId } = msg.metadata;
    if (!correlationId) {
      throw new Error('correlationId must be provided.');
    }

    let response: MessageResponse<any>;

    if (msg.type === 'App.Ping') {
      response = buildMessageResponse('App.Pong', 'success', {
        payload: 'pong',
        correlationId,
      });
    } else if (msg.type === 'Document.List') {
      const result = await this.documentService.getDocuments();
      if (result.success) {
        response = buildMessageResponse('Document.List.Response', 'success', {
          payload: { documents: result.value },
          correlationId,
        });
      } else {
        response = buildMessageResponse('Document.List.Response', 'error', {
          payload: {
            title: 'Error',
            detail: result.error,
          },
          correlationId,
        });
      }
    } else if (msg.type === 'Document.Get') {
      const { id } = msg.payload;
      const result = await this.documentService.getDocument({ id });
      if (result.success) {
        response = buildMessageResponse('Document.Get.Response', 'success', {
          payload: result.value,
          correlationId,
        });
      } else {
        response = buildMessageResponse('Document.Get.Response', 'error', {
          payload: {
            title: 'Error',
            detail:
              result.error || 'Something went wrong getting the document.',
          },
          correlationId,
        });
      }
    } else if (msg.type === 'Document.Create') {
      const { content } = msg.payload;
      const result = await this.documentService.createDocument({ content });
      if (result.success) {
        response = buildMessageResponse('Document.Create.Response', 'success', {
          payload: result.value,
          correlationId,
        });
      } else {
        response = buildMessageResponse('Document.Create.Response', 'error', {
          payload: {
            title: 'Error',
            detail:
              result.error || 'Something went wrong creating the document.',
          },
          correlationId,
        });
      }
    } else if (msg.type === 'Document.Update') {
      const { id, content } = msg.payload;
      const result = await this.documentService.updateDocument({
        id,
        content,
      });
      const { correlationId } = msg.metadata;
      if (result.success) {
        response = buildMessageResponse('Document.Update.Response', 'success', {
          payload: { id, content },
          correlationId,
        });
      } else {
        response = buildMessageResponse('Document.Update.Response', 'error', {
          payload: {
            title: 'Error',
            detail:
              result.error || 'Something went wrong updating the document.',
          },
          correlationId,
        });
      }
    } else if (msg.type === 'Document.Delete') {
      const { id } = msg.payload;
      const result = await this.documentService.deleteDocument({ id });
      if (result.success) {
        response = buildMessageResponse('Document.Delete.Response', 'success', {
          payload: { id },
          correlationId,
        });
      } else {
        response = buildMessageResponse('Document.Delete.Response', 'error', {
          payload: {
            title: 'Error',
            detail:
              result.error || 'Something went wrong deleting the document.',
          },
          correlationId,
        });
      }
    } else {
      response = buildMessageResponse('App.Error', 'error', {
        payload: {
          type: 'App.UnknownMessageTypeError',
          title: `Unknown message type: ${msg.type}`,
        },
      });
    }

    return response;
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
