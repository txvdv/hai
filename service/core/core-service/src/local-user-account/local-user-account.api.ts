import { ClientError } from '../shared/client-error.js';

export const CreateLocalUserAccount = 'LocalUserAccount.Create';
export type CreateLocalUserAccountResult = {
  id: string;
};

export const DeleteLocalUserAccount = 'LocalUserAccount.Delete';

export const GetLocalUserAccount = 'LocalUserAccount.Get';
export type GetDocumentPayload = {
  id: string;
};

export const UpdateLocalUserAccount = 'LocalUserAccount.Update';
export type UpdateLocalUserAccountPayload = {
  id: string;
};

export class LocalUserAccountAlreadyExistsError extends ClientError {
  constructor() {
    super('Local user account already exists', []);
  }
}
