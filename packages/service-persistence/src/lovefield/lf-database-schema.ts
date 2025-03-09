import lf from "lovefield";

/**
 * @see https://github.com/google/lovefield/blob/master/docs/spec/01_schema.md
 */
export function createSchema(name: string, version: number): lf.schema.Builder {
  const schemaBuilder = lf.schema.create(name, version);

  // -----------------------------------------------------------------------------
  // Document
  // -----------------------------------------------------------------------------
  schemaBuilder
    .createTable("Document")
    .addColumn("id", lf.Type.STRING)
    .addColumn("content", lf.Type.STRING)
    .addPrimaryKey(["id"]);

  return schemaBuilder;
}
