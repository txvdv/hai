import { buildMessageResponse } from './app-messaging.js';
import { DxDatabase, DxDocumentRepository, UnitOfWork } from '@hai/service-infra';

export function getAppService(): AppService {
  return AppServiceImpl.getInstance();
}

export interface AppService {
  handleMessage(msg: any): void;

  handleMessageAsync(msg: any): Promise<any>;

  startup(): Promise<void>;

  teardown(): Promise<void>;
}

interface AppServiceConfig {
  // Add configurable options here
}

class AppServiceImpl implements AppService {
  private static instance: AppServiceImpl | null = null;
  private started: boolean = false;

  private db: DxDatabase;
  private uow: UnitOfWork;
  private repo: DxDocumentRepository;

  private constructor(config: AppServiceConfig = {}) {
    this.db = new DxDatabase();
    this.uow = new UnitOfWork(this.db);
    this.repo = new DxDocumentRepository(this.db);
  }

  public static getInstance(config: AppServiceConfig = {}): AppServiceImpl {
    if (this.instance === null) {
      this.instance = new AppServiceImpl(config);
    }
    return this.instance;
  }

  handleMessage(msg: any): void {
    if (!this.started) {
      throw new Error('AppService not started.');
    }
  }

  async handleMessageAsync(msg: any): Promise<any> {
    if (!this.started) {
      throw new Error('AppService not started.');
    }

    const { correlationId } = msg.metadata;
    if (!correlationId) {
      throw new Error('correlationId must be provided.');
    }

    const document = {id: '123', content: 'test'};
    this.uow.start()
    // @ts-ignore
    this.repo.save(document)
    await this.uow.commit()

    const savedDocument = await this.repo.getDocument('123')

    const res = buildMessageResponse(
      'App.Pong', 'success', {
        payload: savedDocument,
        correlationId
      }
    )

    return res;
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
