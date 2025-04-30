import { Message, Result } from '../Messaging/messaging.interface.js';

export class CreateDocumentCommand implements Message {
  readonly type = 'CreateDocumentCommand';
  readonly content: string;

  constructor(content: string) {
    this.content = content;
  }

  static createWith(props: { content: string }): CreateDocumentCommand {
    return new CreateDocumentCommand(props.content);
  }
}

export type CreateDocumentResult = Result<{ id: string }>;
