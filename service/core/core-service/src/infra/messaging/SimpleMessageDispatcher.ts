import {
  Message,
  MessageDispatcher,
  MessageHandler,
  Result,
} from '../../application/Messaging/messaging.interface.js';

export class SimpleMessageDispatcher implements MessageDispatcher {
  private handlers = new Map<string, MessageHandler<any, any>>();

  register<TMessage extends Message, TResult extends Result<any, any>>(
    type: string,
    handler: MessageHandler<TMessage, TResult>
  ): void {
    this.handlers.set(type, handler);
  }

  async sendAndWait<TMessage extends Message, TResult extends Result<any, any>>(
    msg: TMessage
  ): Promise<TResult> {
    const handler = this.handlers.get(msg.type);
    if (!handler) {
      throw new Error(`No handler registered for msg type: ${msg.type}`);
    }
    return await handler.handle(msg);
  }
}
