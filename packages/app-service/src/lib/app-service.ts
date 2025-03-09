import { MessageResponse, MessageEnvelope, buildMessageResponse } from '@hai/app-messaging';
import { DocumentService } from '@hai/document-service';

export function getAppService(): AppService {
  return AppServiceImpl.getInstance();
}

export interface AppService {
  handleMessage(msg: MessageEnvelope): void;

  handleMessageAsync(msg: MessageEnvelope): Promise<MessageResponse<any>>;

  startup(): Promise<void>;

  teardown(): Promise<void>;
}

interface AppServiceConfig {
  // Add configurable options here
}

class AppServiceImpl implements AppService {
  private static instance: AppServiceImpl | null = null;
  private started: boolean = false;
  private readonly config: AppServiceConfig;
  private readonly documentService: DocumentService;

  private constructor(config: AppServiceConfig = {}) {
    this.config = config;
    this.documentService = new DocumentService();
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

  async handleMessageAsync(msg: MessageEnvelope): Promise<MessageResponse<any>> {
    if (!this.started) {
      throw new Error('AppService not started.');
    }

    const {correlationId} = msg.metadata;
    if (!correlationId) {
      throw new Error('correlationId must be provided.');
    }

    let res: MessageResponse<any>

    if (msg.type === 'App.Ping') {
      res = buildMessageResponse(
        'App.Pong', 'success', {
          payload: 'pong',
          correlationId
        }
      )
    } else if (msg.type === 'Document.List') {
      const documents = await this.documentService.getDocuments();
      res = buildMessageResponse(
        'Document.List.Response', 'success', {
          payload: { documents },
          correlationId
        }
      );
    } else if (msg.type === 'Document.Create') {
      const {content} = msg.payload;
      const document = await this.documentService.createDocument(content);
      res = buildMessageResponse(
        'Document.Create.Response', 'success', {
          payload: document,
          correlationId
        }
      )
    } else if (msg.type === 'Document.Update') {
      const {id, content} = msg.payload;
      await this.documentService.updateDocument(id, content);
      const {correlationId} = msg.metadata;
      res = buildMessageResponse(
        'Document.Update.Response', 'success', {
          payload: { id, content },
          correlationId
        }
      )
    }

    else if (msg.type === 'Document.Delete') {
      const {id} = msg.payload;
      await this.documentService.deleteDocument(id);
      res = buildMessageResponse(
        "Document.Delete.Response", "success", {
          payload: { id },
          correlationId
        }
      )
    } else {
      res = buildMessageResponse(
        'App.Error', 'error', {
          payload: {
            type: 'App.UnknownMessageTypeError',
            title: `Unknown message type: ${msg.type}`,
          },
        }
      )
    }

    return res;
  }

  async startup(): Promise<void> {
    this.started = true;
    console.log('Service started with config:', this.config);
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
}

export type PingResponseMessage = MessageResponse<string> & {
  type: 'App.Pong';
}