import { Entity } from 'dexie';
import type {
  LocalUserAccount,
  LocalUserAccountRepository,
} from '@hai/core-service';
import { DxDatabase } from './database.js';

export class LocalUserAccountEntity extends Entity<DxDatabase> {
  id!: string;
}

export class DxLocalUserAccountRepository
  implements LocalUserAccountRepository
{
  constructor(private db: DxDatabase) {}

  deleteLocalUser(): void {
    this.db.addOperation(this.db.localUserAccounts, async () => {
      const user = await this.getLocalUser();
      await this.db.localUserAccounts.delete(user.id);

      // const [account] = await this.db.localUserAccounts.toArray();
      // console.log('Deleting local user account', account);
      // if (!account) throw new Error('Local user not found');
      // await this.db.localUserAccounts.delete(account.id);

      // await this.db.localUserAccounts.delete('123');
    });
  }

  deleteLocalUserWithId(id: string): void {
    this.db.addOperation(this.db.localUserAccounts, async () => {
      await this.db.localUserAccounts.delete(id);
    });
  }

  async getLocalUser(): Promise<LocalUserAccount> {
    const [account] = await this.db.localUserAccounts.toArray();
    if (!account) throw new Error('Local user not found');
    return asLocalUserAccount(account);
  }

  async hasLocalUser(): Promise<boolean> {
    const [account] = await this.db.localUserAccounts.toArray();
    return !!account;
  }

  save(doc: LocalUserAccount): void {
    this.db.addOperation(this.db.localUserAccounts, async () => {
      await this.db.localUserAccounts.put(mapToLocalUserAccountEntity(doc));
    });
  }
}

function mapToLocalUserAccountEntity(
  dom: LocalUserAccount
): LocalUserAccountEntity {
  return dom as unknown as LocalUserAccountEntity;
}

function asLocalUserAccount(ent: LocalUserAccountEntity): LocalUserAccount {
  return {
    id: ent.id,
  };
}
