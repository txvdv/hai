import { Message } from '../Messaging/messaging.interface.js';

export class GetDocumentQuery implements Message {
  readonly type = 'GetDocumentQuery';
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
