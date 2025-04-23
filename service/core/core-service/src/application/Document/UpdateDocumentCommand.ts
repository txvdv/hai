import { Message } from '../Messaging/messaging.interface.js';

export class UpdateDocumentCommand implements Message {
  readonly type = 'UpdateDocumentCommand';
  readonly id: string;
  readonly content: string;

  constructor(id: string, content: string) {
    this.id = id;
    this.content = content;
  }
}
