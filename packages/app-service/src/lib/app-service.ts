import { MessageResponse, MessageEnvelope, buildMessageResponse } from '@hai/app-messaging';

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

  private constructor(config: AppServiceConfig = {}) {
    this.config = config;
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

    const res: PingResponseMessage = buildMessageResponse(
      'App.Pong', 'success', {
        payload: 'pong',
        correlationId
      }
    )

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

type PingResponseMessage = MessageResponse<string> & {
  type: 'App.Pong';
}