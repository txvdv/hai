import { ClientError } from './ClientError.js';

export class EntityNotFoundError extends ClientError {
  constructor(message: string) {
    super(message, []);
  }
}
