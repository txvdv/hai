import { Message } from '../Messaging/messaging.interface.js';

export class DeleteDocumentCommand implements Message {
  readonly type = 'DeleteDocumentCommand';
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
