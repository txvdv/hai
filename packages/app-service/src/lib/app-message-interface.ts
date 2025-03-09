export interface MessageEnvelope<T = any> {
  type: string;          // The type of message, e.g., "User.AddNickname"
  context?: {
    userId?: string;            // The userId associated with the message (optional)
    [key: string]: any;         // Additional contextual information if needed
  };
  metadata: {
    messageId: string;          // Unique identifier for the message
    correlationId?: string;     // Optional: Correlation ID for request-response tracking
    timestamp: string;          // Timestamp when the message was created/sent
    [key: string]: any;         // Additional metadata that could be added in the future
  };
  payload?: T;                   // The main content of the message (the business data)
}

export function buildMessage<T, M extends string>(
  type: M,
  config: {
    context?: { [key: string]: any };
    payload?: T;
    correlationId?: string;
  } = {}
): MessageEnvelope<T> & { type: M } {
  return {
    type,
    context: config.context,
    metadata: {
      messageId: generateUniqueId(),
      correlationId: config.correlationId,
      timestamp: new Date().toISOString()
    },
    payload: config.payload
  };
}

/**
 * Helper function to generate a unique message ID (example implementation)
 */
function generateUniqueId(): string {
  return [...Array(9)].map(() => Math.random().toString(36)[2]).join('');
}

export interface ResponseEnvelope<T = any> extends MessageEnvelope<T> {
  status: 'success' | 'error';   // Indicates if the request was successful or encountered an error
}

/**
 * Problem Details
 * Inspired by "Problem Details for HTTP APIs"
 * @see https://www.rfc-editor.org/rfc/rfc9457.html
 */
export interface ProblemDetails {
  /**
   * A unique reference that identifies the problem type.
   */
  type: string;
  /**
   * A short, human-readable summary of the problem type.
   */
  title: string;
  /**
   * A human-readable explanation specific to this occurrence of the problem.
   * The "detail" string, if present, ought to focus on helping the client
   * correct the problem, rather than giving debugging information.
   */
  detail?: string;
  /**
   * An array of error details to accompany a problem details response.
   */
  errors?: Array<{
    /**
     * A granular description on the specific error related to a body property,
     * query parameter, path parameters, and/or header.
     */
    detail: string
    /**
     * A JSON Pointer to a specific request body property that is the source of error.
     */
    pointer?: string
  }>;
}

export function buildResponse<T extends string, P>(
  type: T,
  status: 'success' | 'error',
  config: {
    context?: { userId?: string; [key: string]: any };
    payload?: P | ProblemDetails;
    correlationId?: string;
  } = {}
): { type: T } & ResponseEnvelope<P | ProblemDetails> {
  return {
    type,
    status,
    context: config.context,
    metadata: {
      messageId: generateUniqueId(),
      correlationId: config.correlationId,
      timestamp: new Date().toISOString()
    },
    payload: config.payload
  };
}

export type MessageResponse<T> = ResponseEnvelope<T> & (
  | { status: 'success'; payload: T }
  | { status: 'error'; payload: ProblemDetails }
  );

export function assertApiSuccess<T>(
  response: MessageResponse<T>
): response is MessageResponse<T> & { status: 'success'; payload: T } {
  return response.status === 'success';
}

export function buildMessageResponse<T extends string, P>(
  type: T,
  status: 'success' | 'error',
  config: {
    context?: { userId?: string; [key: string]: any };
    payload: P | ProblemDetails;
    correlationId?: string;
  }
): { type: T } & (MessageResponse<P> & { status: 'success'; payload: P } | MessageResponse<P> & { status: 'error'; payload: ProblemDetails }) {
  if (status === 'success') {
    return {
      type,
      status,
      context: config.context,
      metadata: {
        messageId: generateUniqueId(),
        correlationId: config.correlationId,
        timestamp: new Date().toISOString(),
      },
      payload: config.payload as P, // Narrow payload type
    } as { type: T } & MessageResponse<P> & { status: 'success'; payload: P };
  } else {
    return {
      type,
      status,
      context: config.context,
      metadata: {
        messageId: generateUniqueId(),
        correlationId: config.correlationId,
        timestamp: new Date().toISOString(),
      },
      payload: config.payload as ProblemDetails, // Narrow payload type
    } as { type: T } & MessageResponse<P> & { status: 'error'; payload: ProblemDetails };
  }
}

/**
 * Ping Pong
 */
export type PingMessage = MessageEnvelope<string> & {
  type: 'App.Ping';
}

export type PingResponseMessage = MessageResponse<string> & {
  type: 'App.Pong';
}

/**
 * Document Messaging
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