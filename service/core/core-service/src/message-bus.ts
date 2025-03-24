import { Result } from './app.types.js';

// MessageBus interface
export interface MessageBus {
  registerCommand<T>(
    type: string,
    handler: (payload?: any) => Promise<Result<T, any>>
  ): void;

  registerQuery<T>(
    type: string,
    handler: (payload?: any) => Promise<Result<T, any>>
  ): void;

  sendAndWait<T>(type: string, payload?: any): Promise<Result<T, any>>; // Send sync commands (request-response)
}

export class InMemoryMessageBus implements MessageBus {
  private syncHandlers: Map<string, (payload?: any) => Promise<any>> =
    new Map();

  registerCommand<T>(
    type: string,
    handler: (payload?: any) => Promise<Result<T, any>>
  ): void {
    this.syncHandlers.set(type, handler);
  }

  registerQuery<T>(
    type: string,
    handler: (payload?: any) => Promise<Result<T, any>>
  ): void {
    this.syncHandlers.set(type, handler);
  }

  sendAndWait<T>(type: string, payload?: any): Promise<Result<T, any>> {
    const handler = this.syncHandlers.get(type);
    if (!handler) throw new Error(`No handler for ${type}`);
    return handler(payload);
  }
}
