import { createUUID } from '@hai/common-utils';

export interface RequestMessageEnvelope<T> {
  /**
   * The type of the message.
   */
  type: string;

  /**
   * Metadata associated with the message.
   */
  metadata: {
    /**
     * Correlation ID for request-response tracking.
     */
    correlationId: string;

    /**
     * A unique identifier for the message.
     */
    messageId: string;

    /**
     * The path over which the message is sent
     */
    messagePath: string;

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
  payload: T;
}

export type ResponseMessageEnvelope<
  TSuccess = unknown,
  TError = ProblemDetails
> =
  | {
      /**
       * The status of the response, indicating success.
       */
      status: 'success';

      /**
       * Metadata associated with the message.
       */
      metadata: {
        /**
         * A unique identifier for the message.
         */
        messageId: string;

        /**
         * Correlation ID for request-response tracking.
         */
        correlationId: string;

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
       * The main content of the message (the business data).
       */
      payload: TSuccess;
    }
  | {
      /**
       * The status of the response, indicating an error.
       */
      status: 'error';

      /**
       * Metadata associated with the message.
       */
      metadata: {
        /**
         * A unique identifier for the message.
         */
        messageId: string;

        /**
         * Correlation ID for request-response tracking.
         */
        correlationId: string;

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
       * The main content of the message (error details).
       */
      payload: TError;
    };

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

export function createRequestMessage<T>(
  path: string,
  type: string,
  payload: T
): RequestMessageEnvelope<T> {
  return {
    type,
    metadata: {
      correlationId: createUUID(),
      messageId: createUUID(),
      messagePath: path,
      timestamp: new Date().toISOString(),
    },
    payload,
  };
}

export function createResponseMessage<TSuccess>(
  request: RequestMessageEnvelope<any>,
  status: 'success',
  payload?: TSuccess,
  additionalMetadata?: Record<string, any>
): ResponseMessageEnvelope<TSuccess>;

export function createResponseMessage<TError = ProblemDetails>(
  request: RequestMessageEnvelope<any>,
  status: 'error',
  payload: TError,
  additionalMetadata?: Record<string, any>
): ResponseMessageEnvelope<never, TError>;

export function createResponseMessage<TSuccess, TError = ProblemDetails>(
  request: RequestMessageEnvelope<any>,
  status: 'success' | 'error',
  payload: TSuccess | TError,
  additionalMetadata: Record<string, any> = {}
): ResponseMessageEnvelope<TSuccess, TError> {
  if (status === 'success') {
    return {
      status: 'success',
      metadata: {
        correlationId: request.metadata.correlationId,
        messageId: createUUID(),
        timestamp: new Date().toISOString(),
        ...additionalMetadata,
      },
      payload: payload as TSuccess,
    };
  } else {
    // Explicitly construct the error case
    return {
      status: 'error',
      metadata: {
        correlationId: request.metadata.correlationId,
        messageId: createUUID(),
        timestamp: new Date().toISOString(),
        ...additionalMetadata,
      },
      payload: payload as TError,
    };
  }
}
