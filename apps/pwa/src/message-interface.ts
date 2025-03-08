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

export type ApiResponse<T = any> = ResponseEnvelope<T | ProblemDetails>;

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

/**
 * Document Messaging API
 */

export interface DocumentCreateMessage extends MessageEnvelope<DocumentCreatePayload> {
  type: 'Document.Create';
}

export interface DocumentCreatePayload {
  content: string;
}

export interface DocumentCreateResponseMessage extends ApiResponse<DocumentCreateResponsePayload> {
  type: 'Document.Create.Response';
}

export interface DocumentCreateResponsePayload {
  id: string;
  content: string;
}

export interface DocumentListMessage extends MessageEnvelope<undefined> {
  type: 'Document.List';
}

export interface DocumentListResponseMessage extends ApiResponse<DocumentListResponsePayload> {
  type: 'Document.List.Response';
}

export interface DocumentListResponsePayload {
  documents: Array<{ id: string, content: string }>;
}

export interface DocumentUpdateMessage extends MessageEnvelope<DocumentUpdatePayload> {
  type: 'Document.Update';
}

export interface DocumentUpdatePayload {
  id: string;
  content: string;
}

export interface DocumentUpdateResponseMessage extends ApiResponse<DocumentUpdateResponsePayload> {
  type: 'Document.Update.Response';
}

export interface DocumentUpdateResponsePayload {
  id: string;
  content: string;
}

export interface DocumentDeleteMessage extends MessageEnvelope<DocumentDeletePayload> {
  type: 'Document.Delete';
}

export interface DocumentDeletePayload {
  id: string;
}

export interface DocumentDeleteResponseMessage extends ApiResponse<DocumentDeleteResponsePayload> {
  type: 'Document.Delete.Response';
}

export interface DocumentDeleteResponsePayload {
  id: string;
}