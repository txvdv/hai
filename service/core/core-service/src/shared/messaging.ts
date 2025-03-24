/**
 * Interface representing a MessageBus for registering and handling commands and queries.
 * It facilitates the dispatch and processing of commands and queries with an associated handler.
 */
export interface MessageBus {
  registerCommand<T>(
    type: string,
    handler: (payload?: any) => Promise<Result<T, any>>
  ): void;

  /**
   * Registers a query handler for a specific query type.
   *
   * @param {string} type - The unique identifier for the query type.
   * @param {(payload?: any) => Promise<Result<T, any>>} handler - A function that handles the query.
   *        The function receives an optional payload and returns a promise resolving to a `Result` object.
   * @return {void} Does not return a value.
   */
  registerQuery<T>(
    type: string,
    handler: (payload?: any) => Promise<Result<T, any>>
  ): void;

  /**
   * Sends a message of the specified type along with an optional payload and waits for a response.
   *
   * @param {string} type - The type of message to send.
   * @param {any} [payload] - An optional payload to send along with the message.
   * @return {Promise<Result<T, any>>} A promise that resolves to a `Result` containing the response of type `T` or an error.
   */
  sendAndWait<T>(type: string, payload?: any): Promise<Result<T, any>>;
}

export class InMemoryMessageBus implements MessageBus {
  private syncHandlers: Map<string, (payload?: any) => Promise<any>> =
    new Map();

  registerCommand<T>(
    type: string,
    handler: (payload?: any) => Promise<Result<T, any>>
  ): void {
    this.syncHandlers.set(type, handler);
  }

  registerQuery<T>(
    type: string,
    handler: (payload?: any) => Promise<Result<T, any>>
  ): void {
    this.syncHandlers.set(type, handler);
  }

  sendAndWait<T>(type: string, payload?: any): Promise<Result<T, any>> {
    const handler = this.syncHandlers.get(type);
    if (!handler) throw new Error(`No handler for ${type}`);
    return handler(payload);
  }
}

export type Result<T, E = undefined> = Ok<T> | Fail<E>;

export class Ok<T> {
  readonly success = true;

  constructor(public readonly data: T) {}
}

export class Fail<E> {
  readonly success = false;

  constructor(public readonly error: E) {}
}

export function success<T>(data: T): Ok<T> {
  return new Ok(data);
}

export function failure<E>(error: E): Fail<E> {
  return new Fail(error);
}
