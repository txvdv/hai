export class DocumentID {
  private constructor(private readonly value: string) {}

  static fromString(id: string): DocumentID {
    return new DocumentID(id);
  }

  static of(id: string): DocumentID {
    return new DocumentID(id);
  }

  toString(): string {
    return this.value;
  }
}
