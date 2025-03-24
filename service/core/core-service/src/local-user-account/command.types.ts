export const CreateLocalUserAccount = 'LocalUserAccount.Create';
export type CreateDocumentPayload = {
  content: string;
};

export const DeleteLocalUserAccount = 'LocalUserAccount.Delete';
export type DeleteDocumentPayload = {
  id: string;
};

export const UpdateLocalUserAccount = 'LocalUserAccount.Update';
export type UpdateLocalUserAccountPayload = {
  id: string;
  content: string;
};
