import { LfDatabase } from './lf-database.js';

describe('LfDatabase', () => {
  let database: LfDatabase;

  beforeEach(() => {
    database = new LfDatabase({ testMode: true });
  });

  // Test 1: Database connection
  it('should connect to the database successfully in test mode', async () => {
    await database.connect();
  });
});