import { MessageResponse, MessageEnvelope } from './app-messaging.js';

export type ComposedDocument = {
  id: string;
  content: string;
};

export type DocumentCreateMessage = MessageEnvelope<DocumentCreatePayload> & {
  type: 'Document.Create';
};

export type DocumentCreatePayload = {
  content: string;
};

export type DocumentCreateResponseMessage =
  MessageResponse<DocumentCreateResponsePayload> & {
    type: 'Document.Create.Response';
  };

export type DocumentCreateResponsePayload = ComposedDocument;

export type DocumentListMessage = MessageEnvelope<undefined> & {
  type: 'Document.List';
};

export type DocumentListResponseMessage =
  MessageResponse<DocumentListResponsePayload> & {
    type: 'Document.List.Response';
  };

export type DocumentListResponsePayload = {
  documents: ComposedDocument[];
};

export type DocumentUpdateMessage = MessageEnvelope<DocumentUpdatePayload> & {
  type: 'Document.Update';
};

export type DocumentUpdatePayload = ComposedDocument;

export type DocumentUpdateResponseMessage =
  MessageResponse<DocumentUpdateResponsePayload> & {
    type: 'Document.Update.Response';
  };

export type DocumentUpdateResponsePayload = ComposedDocument;

export type DocumentDeleteMessage = MessageEnvelope<DocumentDeletePayload> & {
  type: 'Document.Delete';
};

export type DocumentDeletePayload = {
  id: string;
};

export type DocumentDeleteResponseMessage =
  MessageResponse<DocumentDeleteResponsePayload> & {
    type: 'Document.Delete.Response';
  };

export type DocumentDeleteResponsePayload = {
  id: string;
};

export type DocumentGetMessage = MessageEnvelope<DocumentGetPayload> & {
  type: 'Document.Get';
};

export type DocumentGetPayload = {
  id: string;
};

export type DocumentGetResponseMessage =
  MessageResponse<DocumentGetResponsePayload> & {
    type: 'Document.Get.Response';
  };

export type DocumentGetResponsePayload = ComposedDocument;
