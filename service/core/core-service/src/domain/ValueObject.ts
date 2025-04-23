import { deepEqual } from '@hai/common-utils';

export abstract class ValueObject<T> {
  equals(other: T): boolean {
    return deepEqual(this, other);
  }

  findInArray(collection: Array<T>): Array<number> {
    const positions: Array<string> = [];

    for (const object in collection) {
      if (this.equals(collection[object])) {
        positions.push(object);
      }
    }

    return positions.map(Number);
  }

  isContainedIn(collection: Array<T>): boolean {
    const positions = this.findInArray.call(this, collection);
    return positions.length > 0;
  }
}
