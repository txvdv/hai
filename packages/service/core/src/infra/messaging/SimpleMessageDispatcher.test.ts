import {
  Message,
  MessageHandler,
} from '../../application/Messaging/messaging.interface.js';
import { SimpleMessageDispatcher } from './SimpleMessageDispatcher.js';

describe('SimpleMessageDispatcher', () => {
  let messageDispatcher: SimpleMessageDispatcher;

  beforeEach(() => {
    messageDispatcher = new SimpleMessageDispatcher();
  });

  it('should register a command handler and execute it', async () => {
    class TestMessage implements Message {
      type = 'TestMessage';
      payload: string;
      constructor(payload: string) {
        this.payload = payload;
      }
    }

    class TestMessageHandler implements MessageHandler<TestMessage, string> {
      async handle(msg: TestMessage): Promise<string> {
        return `Handled: ${msg.payload}`;
      }
    }

    const handler = new TestMessageHandler();
    messageDispatcher.register('TestMessage', handler);

    const msg = new TestMessage('Hello, World!');
    const result = await messageDispatcher.sendAndWait(msg);

    expect(result).toBe('Handled: Hello, World!');
  });

  it('should throw an error if no handler is registered for a msg type', async () => {
    class UnregisteredMessage implements Message {
      type = 'UnregisteredMessage';
    }

    const msg = new UnregisteredMessage();

    await expect(messageDispatcher.sendAndWait(msg)).rejects.toThrow(
      'No handler registered for msg type: UnregisteredMessage'
    );
  });
});
