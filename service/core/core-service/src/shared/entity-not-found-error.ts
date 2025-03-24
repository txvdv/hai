import { ClientError } from './client-error.js';

export class EntityNotFoundError extends ClientError {
  constructor(message: string) {
    super(message, []);
  }
}
