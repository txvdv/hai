import { ClientError } from '../../shared/errors.js';

export class UserAlreadyExistsError extends ClientError {
  constructor() {
    super('User account already exists', []);
  }
}
