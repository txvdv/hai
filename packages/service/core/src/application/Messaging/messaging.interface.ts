export interface Message {
  type: string;
}

export interface MessageHandler<
  TMessage extends Message,
  TResult extends Result<any, any>
> {
  handle(msg: TMessage): Promise<TResult>;
}

export interface MessageDispatcher {
  register<TMessage extends Message, TResult extends Result<any, any>>(
    type: string,
    handler: MessageHandler<TMessage, TResult>
  ): void;

  sendAndWait<TMessage extends Message, TResult extends Result<any, any>>(
    msg: TMessage
  ): Promise<TResult>;
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
