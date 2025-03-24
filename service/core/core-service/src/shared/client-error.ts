import { AppError } from './app-error.js';

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
