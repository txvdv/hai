import { createUUID } from '@hai/common-utils';

/**
 * A generic interface representing an envelope for messages.
 *
 * @template T - The type of the payload.
 */
export interface MessageEnvelope<T = any> {
  /**
   * The type of the message (e.g., "User.AddNickname").
   */
  type: string;

  /**
   * The contextual information associated with the message (optional).
   */
  context?: {
    /**
     * The ID of the user associated with the message (optional).
     */
    userId?: string;

    /**
     * Additional contextual information, if needed.
     */
    [key: string]: any;
  };

  /**
   * Metadata associated with the message.
   */
  metadata: {
    /**
     * A unique identifier for the message.
     */
    messageId: string;

    /**
     * Optional correlation ID for request-response tracking.
     */
    correlationId?: string;

    /**
     * The timestamp at which the message was created or sent.
     */
    timestamp: string;

    /**
     * Additional metadata fields that could be added in the future.
     */
    [key: string]: any;
  };

  /**
   * The main content of the message (the business data); optional.
   */
  payload?: T;
}

/**
 * Constructs a new message envelope.
 *
 * @template T - The type of the payload.
 * @template M - The type of the message.
 *
 * @param type - The message type (e.g., "User.AddNickname").
 * @param config - The configuration object containing optional context, payload, and correlationId.
 * @returns A new `MessageEnvelope` object with the given type and configuration.
 */
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
      messageId: createUUID(),
      correlationId: config.correlationId,
      timestamp: new Date().toISOString(),
    },
    payload: config.payload,
  };
}

/**
 * An interface extending `MessageEnvelope` to include response-related fields.
 *
 * @template T - The type of the payload.
 */
export interface ResponseEnvelope<T = any> extends MessageEnvelope<T> {
  /**
   * The status of the response, indicating success or error.
   */
  status: 'success' | 'error';
}

/**
 * Interface representing details about a problem response.
 * Inspired by "Problem Details for HTTP APIs" (RFC 9457).
 *
 * @see https://www.rfc-editor.org/rfc/rfc9457.html
 */
export interface ProblemDetails {
  /**
   * A unique reference used to identify the type of problem.
   */
  type: string;

  /**
   * A short, human-readable summary of the problem.
   */
  title: string;

  /**
   * A detailed human-readable explanation of the problem, if available.
   */
  detail?: string;

  /**
   * A list of specific errors related to the problem.
   */
  errors?: Array<{
    /**
     * A detailed description of the specific error, e.g., validation errors.
     */
    detail: string;

    /**
     * A JSON Pointer pointing to the specific request body property causing the error.
     */
    pointer?: string;
  }>;
}

/**
 * Constructs a response envelope.
 *
 * @template T - The message type.
 * @template P - The type of the payload.
 *
 * @param type - The type of the response message.
 * @param status - The status of the response ('success' or 'error').
 * @param config - The configuration containing context, payload, and optional correlationId.
 * @returns A new `ResponseEnvelope` object with the given type, status, and payload.
 */
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
      messageId: createUUID(),
      correlationId: config.correlationId,
      timestamp: new Date().toISOString(),
    },
    payload: config.payload,
  };
}

/**
 * A type representing a response message, either a success response or an error response.
 *
 * @template T - The type of the payload.
 */
export type MessageResponse<T> = ResponseEnvelope<T> &
  (
    | { status: 'success'; payload: T }
    | { status: 'error'; payload: ProblemDetails }
  );

/**
 * Determines if an API response was successful based on its status.
 *
 * @template T - The type of the payload.
 *
 * @param response - The response to check.
 * @returns `true` if the response was successful, otherwise `false`.
 */
export function assertApiSuccess<T>(
  response: MessageResponse<T>
): response is MessageResponse<T> & { status: 'success'; payload: T } {
  return response.status === 'success';
}

/**
 * Constructs a message response based on the provided type, status, and configuration.
 *
 * @template T - The type of the message.
 * @template P - The type of the payload.
 *
 * @param type - The message type.
 * @param status - The response status ('success' or 'error').
 * @param config - The configuration object containing context, payload, and correlationId.
 * @returns A constructed response tailored to the provided type and status.
 */
export function buildMessageResponse<T extends string, P>(
  type: T,
  status: 'success' | 'error',
  config: {
    context?: { userId?: string; [key: string]: any };
    payload: P | ProblemDetails;
    correlationId?: string;
  }
): { type: T } & (
  | (MessageResponse<P> & { status: 'success'; payload: P })
  | (MessageResponse<P> & { status: 'error'; payload: ProblemDetails })
) {
  if (status === 'success') {
    return {
      type,
      status,
      context: config.context,
      metadata: {
        messageId: createUUID(),
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
        messageId: createUUID(),
        correlationId: config.correlationId,
        timestamp: new Date().toISOString(),
      },
      payload: config.payload as ProblemDetails,
    } as { type: T } & MessageResponse<P> & {
        status: 'error';
        payload: ProblemDetails;
      };
  }
}
