import { createUUID } from '@hai/common-utils';
import { LocalUserAccount } from './local-user-account.js';
import { LocalUserAccountRepository } from './local-user-account.repository.js';
import { Result, success, UnitOfWork } from '../app.types.js';

export class LocalUserAccountService {
  private readonly localUserAccountRepository: LocalUserAccountRepository;
  private uow: UnitOfWork;

  constructor(deps: {
    localUserAccountRepository: LocalUserAccountRepository;
    uow: UnitOfWork;
  }) {
    this.localUserAccountRepository = deps.localUserAccountRepository;
    this.uow = deps.uow;
  }

  async createAccount(): Promise<Result<void>> {
    const userId = createUUID();
    const user = new LocalUserAccount(userId);
    this.uow.start();
    this.localUserAccountRepository.save(user);
    await this.uow.commit();
    return success(undefined);
  }

  async deleteAccount(): Promise<Result<void>> {
    this.uow.start();
    this.localUserAccountRepository.deleteLocalUser();
    await this.uow.commit();
    return success(undefined);
  }

  async getAccount() {
    const user = await this.localUserAccountRepository.getLocalUser();
    return success(user);
  }
}
