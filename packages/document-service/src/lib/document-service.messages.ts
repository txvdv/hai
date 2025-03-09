import { MessageResponse, MessageEnvelope } from '@hai/app-messaging';

/**
 * Document Messaging API
 */
export type DocumentCreateMessage = MessageEnvelope<DocumentCreatePayload> & {
  type: 'Document.Create';
}

export type DocumentCreatePayload = {
  content: string;
}

export type DocumentCreateResponseMessage = MessageResponse<DocumentCreateResponsePayload> & {
  type: 'Document.Create.Response';
}

export type DocumentCreateResponsePayload = {
  id: string;
  content: string;
}

export type DocumentListMessage = MessageEnvelope<undefined> & {
  type: 'Document.List';
}

export type DocumentListResponseMessage = MessageResponse<DocumentListResponsePayload> & {
  type: 'Document.List.Response';
}

export type DocumentListResponsePayload = {
  documents: Array<{ id: string, content: string }>;
}

export type DocumentUpdateMessage = MessageEnvelope<DocumentUpdatePayload> & {
  type: 'Document.Update';
}

export type DocumentUpdatePayload = {
  id: string;
  content: string;
}

export type DocumentUpdateResponseMessage = MessageResponse<DocumentUpdateResponsePayload> & {
  type: 'Document.Update.Response';
}

export type DocumentUpdateResponsePayload = {
  id: string;
  content: string;
}

export type DocumentDeleteMessage = MessageEnvelope<DocumentDeletePayload> & {
  type: 'Document.Delete';
}

export type DocumentDeletePayload = {
  id: string;
}

export type DocumentDeleteResponseMessage = MessageResponse<DocumentDeleteResponsePayload> & {
  type: 'Document.Delete.Response';
}

export type DocumentDeleteResponsePayload = {
  id: string;
}