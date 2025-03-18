export const CreateDocument = 'Document.Create';
export type CreateDocumentPayload = {
  content: string;
};

export const DeleteDocument = 'Document.Delete';
export type DeleteDocumentPayload = {
  id: string;
};

export const GetDocument = 'Document.Get';
export type GetDocumentPayload = {
  id: string;
};

export const UpdateDocument = 'Document.Update';
export type UpdateDocumentPayload = {
  id: string;
  content: string;
};

export type ComposedDocument = {
  id: string;
  content: string;
};
