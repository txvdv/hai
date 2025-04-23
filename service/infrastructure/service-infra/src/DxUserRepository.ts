import { DxDatabase } from './database.js';
import { User, UserID, UserRepository } from '@hai/core-service';

export interface UserEntityRecord {
  id: string;
  preferences: {
    actOnInsert: boolean;
    colorScheme: 'system' | 'light' | 'dark';
    jumpToNextPick: boolean;
    previewOnHover: boolean;
  };
}

export class DxUserRepository implements UserRepository {
  constructor(private db: DxDatabase) {}

  clear(): void {
    this.db.addOperation(this.db.users, async () => {
      const user = await this.getCreated();
      await this.db.users.delete(user.getIdentifier().toString());
    });
  }

  async getCreated(): Promise<User> {
    const [account] = await this.db.users.toArray();
    if (!account) throw new Error('Local user not found');
    return asEntity(account);
  }

  async hasUser(): Promise<boolean> {
    const [account] = await this.db.users.toArray();
    return !!account;
  }

  async load(id: UserID): Promise<User> {
    return this.getCreated();
  }

  save(user: User): void {
    this.db.addOperation(this.db.users, async () => {
      await this.db.users.put(asRecord(user));
    });
  }
}

function asRecord(dom: User): UserEntityRecord {
  const state = dom.getState();
  return {
    id: state.id,
    preferences: state.preferences,
  };
}

function asEntity(rec: UserEntityRecord): User {
  return User.fromState(rec);
}
