export interface UnitOfWork {
  start(): void;
  commit(): Promise<void>;
}
