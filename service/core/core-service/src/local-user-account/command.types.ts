import { ClientError } from '../shared/ClientError.js';

export const CreateLocalUserAccount = 'LocalUserAccount.Create';
export type CreateLocalUserAccountResult = {
  userId: string;
};

export const DeleteLocalUserAccount = 'LocalUserAccount.Delete';

export const UpdateLocalUserAccount = 'LocalUserAccount.Update';
export type UpdateLocalUserAccountPayload = {
  userId: string;
};

export class LocalUserAccountAlreadyExistsError extends ClientError {
  constructor() {
    super('Local user account already exists', []);
  }
}
