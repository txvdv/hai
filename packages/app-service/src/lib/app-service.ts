export function getAppService(): AppService {
  return AppServiceImpl.getInstance();
}

interface AppService {
  handleMessage(msg: string): Promise<string>;

  startup(): Promise<void>;

  teardown(): Promise<void>;
}

interface AppServiceConfig {
  // Add configurable options here
}

class AppServiceImpl implements AppService {
  private static instance: AppServiceImpl | null = null;
  private started: boolean = false;
  private readonly config: AppServiceConfig;

  // Private constructor, now configurable
  private constructor(config: AppServiceConfig = {}) {
    this.config = config;
  }

  // Static method to get (or create) the singleton instance
  public static getInstance(config: AppServiceConfig = {}): AppServiceImpl {
    if (this.instance === null) {
      this.instance = new AppServiceImpl(config);
    }
    return this.instance;
  }

  async handleMessage(msg: string): Promise<string> {
    if (!this.started) {
      throw new Error('AppService not started.');
    }

    return `${msg} + app-service`;
  }

  async startup(): Promise<void> {
    this.started = true;
    console.log('Service started with config:', this.config);
  }

  async teardown(): Promise<void> {
    this.started = false;

    // Reset singleton instance to allow new configuration
    AppServiceImpl.instance = null;
    console.log('Service has been torn down and instance reset.');
  }
}