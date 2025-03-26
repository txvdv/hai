import { ClientError, EntityNotFoundError } from '../shared/errors.js';
import { Command, Query, Result } from '../shared/messaging.js';
import { LocalUserAccount } from './local-user-account.js';

export class CreateLocalUserAccount extends Command {
  public static override readonly type = 'CreateLocalUserAccount';
  constructor() {
    super(undefined, undefined);
  }
}
export type CreateLocalUserAccountResult = Result<
  {
    id: string;
  },
  LocalUserAccountAlreadyExistsError
>;

export class DeleteLocalUserAccount extends Command {
  public static override readonly type = 'DeleteLocalUserAccount';
  constructor() {
    super(undefined, undefined);
  }
}
export type DeleteLocalUserAccountResult = Result<void, EntityNotFoundError>;

export class GetLocalUserAccount extends Query {
  public static override readonly type = 'GetLocalUserAccount';
  constructor() {
    super(undefined, undefined);
  }
}
export type GetLocalUserAccountResult = Result<
  LocalUserAccount,
  EntityNotFoundError
>;

export class UpdateLocalUserAccount extends Command {
  public static override readonly type = 'UpdateLocalUserAccount';
  constructor(
    public override readonly payload: {
      id: string;
    }
  ) {
    super(payload, undefined);
  }
}

export type UpdateLocalUserAccountPayload = {
  id: string;
};

export class LocalUserAccountAlreadyExistsError extends ClientError {
  constructor() {
    super('Local user account already exists', []);
  }
}
