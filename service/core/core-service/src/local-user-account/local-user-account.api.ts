import { ClientError, EntityNotFoundError } from '../shared/errors.js';
import { CQMessage, Result } from '../shared/messaging.js';
import { LocalUserAccount } from './local-user-account.js';

export interface CreateLocalUserAccount extends CQMessage {
  type: 'CreateLocalUserAccount';
}
export type CreateLocalUserAccountResult = Result<
  {
    id: string;
  },
  LocalUserAccountAlreadyExistsError
>;

export interface DeleteLocalUserAccount extends CQMessage {
  type: 'DeleteLocalUserAccount';
}
export type DeleteLocalUserAccountResult = Result<void, EntityNotFoundError>;

export interface GetLocalUserAccount extends CQMessage {
  type: 'GetLocalUserAccount';
}
export type GetLocalUserAccountResult = Result<
  LocalUserAccount,
  EntityNotFoundError
>;

export interface UpdateLocalUserAccount extends CQMessage {
  type: 'UpdateLocalUserAccount';
  payload: {
    id: string;
  };
}

export type UpdateLocalUserAccountPayload = {
  id: string;
};

export class LocalUserAccountAlreadyExistsError extends ClientError {
  constructor() {
    super('Local user account already exists', []);
  }
}
