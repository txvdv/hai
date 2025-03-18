import {
  DxDatabase,
  DxDocumentRepository,
  UnitOfWork,
} from '@hai/service-infra';
import { Application, InMemoryMessageBus, MessageBus } from '@hai/core-service';

export class AppTester {
  private readonly db: DxDatabase;
  private readonly documentRepository: DxDocumentRepository;
  private readonly messageBus: MessageBus;
  private readonly uow: UnitOfWork;

  constructor() {
    this.db = new DxDatabase();
    this.uow = new UnitOfWork(this.db);
    this.documentRepository = new DxDocumentRepository(this.db);
    this.messageBus = new InMemoryMessageBus();

    new Application({
      documentRepository: this.documentRepository,
      messageBus: this.messageBus,
      unitOfWork: this.uow,
    });
  }

  async sendAndWait(type: string, payload: any): Promise<any> {
    return this.messageBus.sendAndWait(type, payload);
  }
}
