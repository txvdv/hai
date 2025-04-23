import { ValueObject } from './ValueObject.js';

class Money extends ValueObject<Money> {
  readonly amount: number;
  readonly currency: string;
  constructor(amount: number, currency: string) {
    super();
    this.amount = amount;
    this.currency = currency;
  }
}

describe('ValueObject', () => {
  describe('equals', () => {
    it('should return true for objects with the same values', () => {
      const vo1 = new Money(10, 'EUR');
      const vo2 = new Money(10, 'EUR');
      expect(vo1.equals(vo2)).toBeTruthy();
    });
    it('should return false for objects with the different values', () => {
      const vo1 = new Money(10, 'EUR');
      const vo2 = new Money(20, 'USD');
      expect(vo1.equals(vo2)).toBeFalsy();
    });
  });
});
