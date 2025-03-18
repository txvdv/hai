export interface UnitOfWork {
  start(): void;
  commit(): Promise<void>;
}

export type Result<T, E = undefined> = Ok<T> | Fail<E>;

export class Ok<T> {
  readonly success = true;

  constructor(public readonly value: T) {}
}

export class Fail<E> {
  readonly success = false;

  constructor(public readonly error: E) {}
}

export function success<T>(value: T): Ok<T> {
  return new Ok(value);
}

export function failure<E>(error: E): Fail<E> {
  return new Fail(error);
}
