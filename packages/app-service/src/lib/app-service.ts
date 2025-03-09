export function getAppService(): Promise<string> {
  const appService = new AppServiceImpl();
  return appService.handleMessage('whatever');
}

interface AppService {
  handleMessage(msg: string): Promise<string>;

  startup(): Promise<void>;

  teardown(): Promise<void>;
}

class AppServiceImpl implements AppService {
  async handleMessage(msg: string): Promise<string> {
    return 'app-service';
    // throw new Error('Method not implemented.');
  }

  async startup(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async teardown(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}