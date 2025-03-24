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
