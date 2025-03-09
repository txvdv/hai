import { getAppService } from './app-service.js';

describe('App Service', () => {
  it('should throw an error if handleMessage is called before startup', async () => {
    const appService = getAppService();

    await expect(appService.handleMessage('test')).rejects.toThrow('AppService not started.');
  });

  it('should append " + app-service" to messages when handleMessage is called after startup', async () => {
    const appService = getAppService();

    await appService.startup();
    const response = await appService.handleMessage('test');
    expect(response).toBe('test + app-service');

    await appService.teardown(); // Cleanup
  });

  it('should reset instance after teardown and allow creating a new configuration', async () => {
    const appService = getAppService();
    await appService.startup();
    await appService.teardown();

    const newAppService = getAppService();

    expect(appService).not.toBe(newAppService);
    await expect(() => newAppService.handleMessage('test')).rejects.toThrow('AppService not started.');
  });

  it('should ensure singleton behavior during runtime (only one instance exists)', () => {
    const appService1 = getAppService();
    const appService2 = getAppService();

    expect(appService1).toBe(appService2);
  });
});