import {
  DxDatabase,
  DxDocumentRepository,
  DxLocalUserAccountRepository,
  UnitOfWork,
} from '@hai/service-infra';
import {
  Application,
  InMemoryMessageBus,
  MessageBus,
  CQMessage,
  Command,
  Query,
} from '@hai/core-service';

export class AppTester {
  private readonly db: DxDatabase;
  private readonly documentRepository: DxDocumentRepository;
  private readonly localUserAccountRepository: DxLocalUserAccountRepository;
  private readonly messageBus: MessageBus;
  private readonly uow: UnitOfWork;

  constructor() {
    this.db = new DxDatabase();
    this.uow = new UnitOfWork(this.db);
    this.documentRepository = new DxDocumentRepository(this.db);
    this.localUserAccountRepository = new DxLocalUserAccountRepository(this.db);
    this.messageBus = new InMemoryMessageBus();

    new Application({
      documentRepository: this.documentRepository,
      localUserAccountRepository: this.localUserAccountRepository,
      messageBus: this.messageBus,
      unitOfWork: this.uow,
    });
  }

  teardown() {
    this.db.deleteDb();
  }

  async sendAndAwait<T extends CQMessage, R>(msg: T): Promise<R> {
    return this.messageBus.sendAndAwait(msg);
  }

  async sendCommand<T>(cmd: Command): Promise<T> {
    return this.messageBus.commandAndWait<T>(cmd);
  }

  async sendQuery<T>(qry: Query): Promise<T> {
    return this.messageBus.queryAndWait<T>(qry);
  }
}
