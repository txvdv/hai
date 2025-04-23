import { Message } from '../Messaging/messaging.interface.js';

export class GetDocumentsQuery implements Message {
  type = 'GetDocumentsQuery';
}
