export type CreateDocument = 'Document.Create';
export type CreateDocumentPayload = {
  content: string;
};

export type DeleteDocument = 'Document.Delete';
export type DeleteDocumentPayload = {
  id: string;
};

export type GetDocument = 'Document.Get';
export type GetDocumentPayload = {
  id: string;
};

export type UpdateDocument = 'Document.Update';
export type UpdateDocumentPayload = {
  id: string;
  content: string;
};
