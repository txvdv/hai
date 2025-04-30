/**
 * https://stackoverflow.com/questions/464359/custom-exception-type/27724419#27724419
 */
export abstract class AppError extends Error {
  override cause?: any;

  protected constructor(message: string, cause?: any) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;

    if (typeof Error.captureStackTrace === 'function')
      Error.captureStackTrace(this, this.constructor);
    else this.stack = new Error(message).stack;
  }
}

/**
 * When inheriting from AppError, take into account that
 * it will be transformed into public ProblemDetails, with the:
 * type: the kebab-cased class name
 * title: space-separated class name
 * detail: the exception message
 * errors: the details, if provided
 */
export class ClientError extends AppError {
  details: ClientErrorDetails | ClientErrorDetailsWithPointer;

  constructor(
    message: string,
    details: ClientErrorDetails | ClientErrorDetailsWithPointer
  ) {
    super(message);
    this.details = details;
  }
}

export type ClientErrorDetails = Array<string>;
export type ClientErrorDetailsWithPointer = Array<{
  pointer: string;
  detail: string;
}>;

export class EntityNotFoundError extends ClientError {
  constructor(message: string) {
    super(message, []);
  }
}
