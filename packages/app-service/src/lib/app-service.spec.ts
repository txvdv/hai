import { AppService, getAppService } from './app-service.js';
import { buildMessage, MessageEnvelope } from '@hai/app-messaging';

describe('App Service', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = getAppService();
  });

  it('should throw an error if handleMessage is called before startup', async () => {
    await expect(appService.handleMessageAsync(testMessage())).rejects.toThrow('AppService not started.');
  });

  it('should append " + app-service" to messages when handleMessage is called after startup', async () => {
    await appService.startup();
    const response = await appService.handleMessageAsync(testMessage());
    expect(response.payload).toBe('pong');

    await appService.teardown(); // Cleanup
  });

  it('should reset instance after teardown and allow creating a new configuration', async () => {
    await appService.startup();
    await appService.teardown();

    const newAppService = getAppService();

    expect(appService).not.toBe(newAppService);
    await expect(() => newAppService.handleMessageAsync(testMessage())).rejects.toThrow('AppService not started.');
  });

  it('should ensure singleton behavior during runtime (only one instance exists)', () => {
    const appService1 = getAppService();
    const appService2 = getAppService();

    expect(appService1).toBe(appService2);
  });
});

function testMessage(): MessageEnvelope {
  return buildMessage('App.Ping', {
    correlationId: generateUniqueId()
  })
}

/**
 * Helper function to generate a unique message ID (example implementation)
 */
function generateUniqueId(): string {
  return [...Array(9)].map(() => Math.random().toString(36)[2]).join('');
}