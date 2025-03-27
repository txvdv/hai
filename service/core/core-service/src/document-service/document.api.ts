import { CQMessage, Result } from '../shared/messaging.js';

export interface CreateDocument extends CQMessage {
  type: 'CreateDocumentCommand';
  payload: {
    content: string;
  };
}
export type CreateDocumentResult = Result<ComposedDocument>;

export interface DeleteDocument extends CQMessage {
  type: 'DeleteDocumentCommand';
  payload: {
    id: string;
  };
}
export type DeleteDocumentResult = Result<void>;

export interface GetDocument extends CQMessage {
  type: 'GetDocumentQuery';
  payload: {
    id: string;
  };
}
export type GetDocumentResult = Result<ComposedDocument, string>;

export interface ListDocuments extends CQMessage {
  type: 'ListDocumentsQuery';
}
export type ListDocumentsResult = Result<ComposedDocument[]>;

export interface UpdateDocument extends CQMessage {
  type: 'UpdateDocumentCommand';
  payload: {
    id: string;
    content: string;
  };
}
export type UpdateDocumentResult = Result<void>;

export type ComposedDocument = {
  id: string;
  content: string;
};
