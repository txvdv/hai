import 'fake-indexeddb/auto';
import {
  DxDatabase,
  DxDocumentRepository,
  DxUserRepository,
  UnitOfWork,
} from '@hai/service-infra';
import {
  Application,
  MessageDispatcher,
  SimpleMessageDispatcher,
  UserRepository,
  DocumentRepository,
} from '@hai/core-service';

export class AppTester {
  private readonly db: DxDatabase;
  private readonly documentRepository: DocumentRepository;
  private readonly userRepository: UserRepository;
  private readonly messageDispatcher: MessageDispatcher;
  private readonly uow: UnitOfWork;

  constructor() {
    this.db = new DxDatabase();
    this.uow = new UnitOfWork(this.db);
    this.documentRepository = new DxDocumentRepository(this.db);
    this.userRepository = new DxUserRepository(this.db);
    this.messageDispatcher = new SimpleMessageDispatcher();

    new Application({
      documentRepository: this.documentRepository,
      messageDispatcher: this.messageDispatcher,
      unitOfWork: this.uow,
      userRepository: this.userRepository,
    });
  }

  teardown() {
    this.db.deleteDb();
  }

  async sendAndWait(msg: any): Promise<any> {
    return this.messageDispatcher.sendAndWait(msg);
  }
}
