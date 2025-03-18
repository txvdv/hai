export enum MessageType {
  CREATE_DOCUMENT = 'CREATE_DOCUMENT',
}

// MessageBus interface
export interface MessageBus {
  sendAndWait<T>(type: string, payload: any): Promise<T>; // Send sync commands (request-response)
  registerCommand<T>(type: string, handler: (payload: any) => Promise<T>): void;
  registerQuery<T>(type: string, handler: (payload: any) => Promise<T>): void;
}

export class InMemoryMessageBus implements MessageBus {
  private syncHandlers: Map<string, (payload: any) => Promise<any>> = new Map();

  registerCommand<T>(
    type: string,
    handler: (payload: any) => Promise<T>
  ): void {
    this.syncHandlers.set(type, handler);
  }

  registerQuery<T>(type: string, handler: (payload: any) => Promise<T>): void {
    this.syncHandlers.set(type, handler);
  }

  sendAndWait<T>(type: string, payload: any): Promise<T> {
    const handler = this.syncHandlers.get(type);
    if (!handler) throw new Error(`No handler for ${type}`);
    return handler(payload);
  }
}
