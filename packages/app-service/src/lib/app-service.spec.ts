import { getAppService } from './app-service.js';

describe('AppService', () => {
  it('should work', async () => {
    expect(await getAppService()).toEqual('app-service');
  });
});
