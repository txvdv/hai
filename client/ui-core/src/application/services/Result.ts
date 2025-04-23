import { ProblemDetails } from '@hai/service-web';

export type Result<T> = Ok<T> | Err<ProblemDetails>;

interface Ok<T> {
  readonly ok: true;
  readonly data: T;
}

interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

export function ok<T>(data: T): Ok<T> {
  return { ok: true, data };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

function foo(): Result<{ id: string }> {
  // Imagine some operation that might succeed or fail
  const someCondition = Math.random() > 0.5;

  if (someCondition) {
    return ok({ id: '123' });
  } else {
    return err({
      type: 'https://example.com/errors/operation-failed',
      title: 'Operation Failed',
      status: 500,
      detail: 'Something went wrong during the operation.',
    });
  }
}

// Example usage:
const result = foo();

if (result.ok) {
  console.log('Success!', result.data.id);
} else {
  console.error('Failure:', result.error.title, result.error.detail);
}
