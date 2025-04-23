import { ValueObject } from '../ValueObject.js';

export class UserID extends ValueObject<UserID> {
  private readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  static of(value: string) {
    return new UserID(value);
  }

  toValue(): string {
    return this.value;
  }

  static fromString(value: string): UserID {
    return new UserID(value);
  }

  override toString(): string {
    return this.value;
  }
}
