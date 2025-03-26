import { createUUID } from '@hai/common-utils';
import { LocalUserAccount } from './local-user-account.js';
import { LocalUserAccountRepository } from './local-user-account.repository.js';
import { UnitOfWork } from '../shared/unit-of-work.js';
import {
  CreateLocalUserAccountResult,
  DeleteLocalUserAccountResult,
  GetLocalUserAccountResult,
  LocalUserAccountAlreadyExistsError,
} from './local-user-account.api.js';
import { EntityNotFoundError } from '../shared/errors.js';
import { failure, success } from '../shared/messaging.js';

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

  async createAccount(): Promise<CreateLocalUserAccountResult> {
    const existingAccount =
      await this.localUserAccountRepository.hasLocalUser();
    if (existingAccount) {
      return failure(new LocalUserAccountAlreadyExistsError());
    }

    const userId = createUUID();
    const user = new LocalUserAccount(userId);

    this.uow.start();
    this.localUserAccountRepository.save(user);
    await this.uow.commit();

    return success({ id: userId });
  }

  async deleteAccount(): Promise<DeleteLocalUserAccountResult> {
    const existingAccount =
      await this.localUserAccountRepository.hasLocalUser();
    if (!existingAccount) {
      return failure(
        new EntityNotFoundError('LocalUserAccount does not exist')
      );
    }

    this.uow.start();
    this.localUserAccountRepository.deleteLocalUser();
    await this.uow.commit();

    return success(undefined);
  }

  async getAccount(): Promise<GetLocalUserAccountResult> {
    const existingAccount =
      await this.localUserAccountRepository.hasLocalUser();
    if (!existingAccount) {
      return failure(
        new EntityNotFoundError('LocalUserAccount does not exist')
      );
    }

    const user = await this.localUserAccountRepository.getLocalUser();
    return success(user);
  }
}
