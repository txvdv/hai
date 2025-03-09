import lf from "lovefield"
import { UnitOfWork } from "@hai/service-core"
import { createSchema } from './lf-database-schema.js';

export class LfDatabase implements UnitOfWork {
  private static DB_NAME = "hai"
  private static DB_VERSION = 1

  private database!: lf.Database
  private inTestMode: boolean = false
  private schema!: lf.schema.Builder
  private transaction: lf.Transaction | null = null
  private transactionTables: {[tablename: string]: any} = {}
  private transactionQueries: Array<() => Promise<void>> = [];

  get db(): lf.Database {
    return this.database
  }

  constructor(config: {testMode: boolean}) {
    this.inTestMode = config.testMode
  }

  close() {
    this.database.close()
  }

  async connect() {
    const storeType = this.inTestMode
      ? lf.schema.DataStoreType.MEMORY
      : lf.schema.DataStoreType.INDEXED_DB

    this.schema = createSchema(LfDatabase.DB_NAME, LfDatabase.DB_VERSION)

    try {
      this.database = await this.schema.connect({storeType})
      console.log("Connected to DB");
    } catch (err) {
      throw new Error(`Unable to connect to DB: ${err}`)
    }

    return Promise.resolve()
  }

  txAttach(tableName: string, tx: any) {
    if (!this.transaction) {
      throw new Error("Transaction not started.")
    }
    this.transactionTables[tableName] = this.database
      .getSchema()
      .table(tableName)
    this.transactionQueries.push(() => this.transaction!.attach(tx).then(() => {}))
  }

  start() {
    this.transaction = this.database.createTransaction()
    this.transactionTables = {}
    this.transactionQueries = []
  }

  async commit(): Promise<void> {
    if (!this.transaction) {
      throw new Error("Transaction not started.");
    }

    // Step 1: Validate transaction tables
    if (!this.transactionTables || typeof this.transactionTables !== "object") {
      throw new Error("Transaction tables are invalid or undefined.");
    }

    try {
      // Step 2: Transform transaction tables to array
      const tablesArray = transformObjectToArray(this.transactionTables).filter(
        (table) => table != null
      );

      if (tablesArray.length === 0) {
        // Gracefully handle empty transaction tables
        return;
      }

      // Step 3: Begin Transaction
      await this.transaction.begin(tablesArray);

      // Step 4: Execute all transaction queries in sequence
      for (const query of this.transactionQueries) {
        await query(); // Ensure sequential execution
      }

      // Step 5: Commit the transaction
      await this.transaction.commit();

      // Success: Clean up transaction state
      this.transaction = null;
      this.transactionTables = {};
      this.transactionQueries = [];
    } catch (err) {
      // Catch and handle errors

      // Step 6: Rollback if needed
      if (this.transaction) {
        await this.transaction.rollback();
      }

      // Log and rethrow the error
      console.error("Transaction commit failed:", err);
      throw err; // Re-throw the error to propagate it to the caller
    } finally {
      // Step 7: Final cleanup
      this.transaction = null; // Reset the transaction state in all cases
      this.transactionTables = {};
      this.transactionQueries = [];
    }
  }
}

/**
 * Transforms an object into an array by extracting its values, excluding any null or undefined values.
 *
 * @template T
 * @param {Record<string, T | null | undefined>} record - The input object whose values will be transformed into an array.
 * @return {T[]} An array containing the non-null and non-undefined values from the input object.
 * @throws {Error} Throws an error if the input is not a valid object.
 */
export function transformObjectToArray<T>(
  record: Record<string, T | null | undefined>
): T[] {
  if (!record || typeof record !== "object") {
    throw new Error("Invalid input: expected a non-null object.")
  }
  return Object.values(record).filter((value): value is T => value != null)
}