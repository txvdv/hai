import { DocumentID } from './DocumentID.js';
import { DocumentState } from './DocumentState.js';

export class Document {
  private content: string;
  private id: DocumentID;

  getContent(): string {
    return this.content;
  }

  getId(): DocumentID {
    return this.id;
  }

  getState(): DocumentState {
    return {
      id: this.id.toString(),
      content: this.content,
    };
  }

  private constructor(props: { id: DocumentID; content: string }) {
    this.id = props.id;
    this.content = props.content;
  }

  static create(props: { id: DocumentID; content: string }): Document {
    return new Document(props);
  }

  static createFromState(state: DocumentState): Document {
    return new Document({
      id: DocumentID.of(state.id),
      content: state.content,
    });
  }

  update(props: { content: string }) {
    this.content = props.content;
  }
}
