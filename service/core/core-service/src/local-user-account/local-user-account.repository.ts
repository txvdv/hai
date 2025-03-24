import { LocalUserAccount } from './local-user-account.js';

export interface LocalUserAccountRepository {
  /**
   * throws EntityNotFound
   */
  deleteLocalUser(): void;

  deleteLocalUserWithId(id: string): void;

  /**
   * throws EntityNotFound
   */
  getLocalUser(): Promise<LocalUserAccount>;

  hasLocalUser(): Promise<boolean>;

  save(user: LocalUserAccount): void;
}
