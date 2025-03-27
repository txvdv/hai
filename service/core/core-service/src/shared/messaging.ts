/**
 * Interface representing a MessageBus for registering and handling commands and queries.
 * It facilitates the dispatch and processing of commands and queries with an associated handler.
 */
export interface MessageBus {
  registerCommand<T>(
    type: string,
    handler: (payload?: any, context?: any) => Promise<Result<T, any>>
  ): void;

  registerCommandHandler<C extends Command, R>(
    type: string,
    handler: (cmd: C) => Promise<R>
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
    handler: (payload?: any, context?: any) => Promise<Result<T, any>>
  ): void;

  registerQueryHandler<T>(
    type: string,
    handler: (qry: Query) => Promise<Result<T, any>>
  ): void;

  /**
   * Sends a message of the specified type along with an optional payload and waits for a response.
   *
   * @param {string} type - The type of message to send.
   * @param {any} [payload] - An optional payload to send along with the message.
   * @param context
   * @return {Promise<Result<T, any>>} A promise that resolves to a `Result` containing the response of type `T` or an error.
   */
  sendAndWait<T>(
    type: string,
    payload?: any,
    context?: any
  ): Promise<Result<T, any>>;

  sendAndAwait<T extends CQMessage, R>(msg: T): Promise<R>;

  registerSaw<T, R>(cmdType: string, handler: (cmd: T) => Promise<R>): void;

  commandAndWait<T>(cmd: Command): Promise<T>;

  queryAndWait<T>(qry: Query): Promise<T>;
}

export class InMemoryMessageBus implements MessageBus {
  private syncHandlers: Map<
    string,
    (payload?: any, context?: any) => Promise<any>
  > = new Map();
  private cHandlers: Map<string, (cmd: any) => Promise<any>> = new Map();
  private commandHandlers: Map<string, (cmd: any) => Promise<any>> = new Map();
  private queryHandlers: Map<string, (qry: Query) => Promise<any>> = new Map();

  registerCommand<T>(
    type: string,
    handler: (payload?: any, context?: any) => Promise<Result<T, any>>
  ): void {
    this.syncHandlers.set(type, handler);
  }

  registerCommandHandler<C extends Command, R>(
    type: string,
    handler: (cmd: C) => Promise<R>
  ): void {
    this.commandHandlers.set(type, handler);
  }

  registerQuery<T>(
    type: string,
    handler: (payload?: any, context?: any) => Promise<Result<T, any>>
  ): void {
    this.syncHandlers.set(type, handler);
  }

  registerQueryHandler<T>(
    type: string,
    handler: (qry: Query) => Promise<Result<T, any>>
  ): void {
    this.queryHandlers.set(type, handler);
  }

  sendAndWait<T>(
    type: string,
    payload?: any,
    context?: any
  ): Promise<Result<T, any>> {
    const handler = this.syncHandlers.get(type);
    if (!handler) throw new Error(`No handler for ${type}`);
    return handler(payload);
  }

  registerSaw<T, R>(cmdType: string, handler: (cmd: T) => Promise<R>): void {
    this.cHandlers.set(cmdType, handler);
  }

  sendAndAwait<T extends CQMessage, R>(msg: T): Promise<R> {
    const handler = this.cHandlers.get(msg.type);
    if (!handler) throw new Error(`No handler for ${msg.type}`);
    return handler(msg);
  }

  commandAndWait<T>(cmd: Command): Promise<T> {
    const type = (cmd.constructor as typeof Command).type;
    const handler = this.commandHandlers.get(type);
    if (!handler) throw new Error(`No handler for ${type}`);
    return handler(cmd);
  }

  queryAndWait<T>(qry: Query): Promise<T> {
    const type = (qry.constructor as typeof Command).type;
    const handler = this.queryHandlers.get(type);
    if (!handler) throw new Error(`No handler for ${type}`);
    return handler(qry);
  }
}

export interface CQMessage {
  type: string;
}

/**
 * Base class for all Commands.
 * Allows an optional `payload` and/or `context`.
 */
export abstract class Command {
  /**
   * Unique string identifying the command type.
   * Each specific command class must override this property.
   */
  public static readonly type: string;

  /**
   * Optional payload or data required for this command.
   */
  public readonly payload?: unknown;

  /**
   * Optional metadata or context for the command.
   */
  public readonly context?: Record<string, any>;

  protected constructor(payload?: unknown, context?: Record<string, any>) {
    this.payload = payload;
    this.context = context;
  }
}

/**
 * Base class for all Queries.
 * Allows an optional `payload` and/or `context`.
 */
export abstract class Query {
  /**
   * Unique string identifying the query type.
   * Each specific query class must override this property.
   */
  public static readonly type: string;

  /**
   * Optional payload or data required for the query.
   */
  public readonly payload?: unknown;

  /**
   * Optional metadata or context for the query.
   */
  public readonly context?: Record<string, any>;

  protected constructor(payload?: unknown, context?: Record<string, any>) {
    this.payload = payload;
    this.context = context;
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
