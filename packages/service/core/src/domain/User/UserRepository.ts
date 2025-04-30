import { User } from './User.js';
import { UserID } from './UserID.js';

export interface UserRepository {
  clear(): void;

  getCreated(): Promise<User>;

  hasUser(): Promise<boolean>;

  load(id: UserID): Promise<User>;

  save(user: User): void;
}
