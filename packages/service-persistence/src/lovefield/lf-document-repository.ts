import lf from "lovefield"
import {LfDatabase} from "./lf-database.js"
import {
  DocumentRepository
} from '@hai/service-core';
import type {
  Document
} from "@hai/service-core"

export class LfDocumentRepository implements DocumentRepository {
  private static tableName = "Document"
  private readonly lfDatabase: LfDatabase

  private get db(): lf.Database {
    return this.lfDatabase.db
  }

  private get table(): lf.schema.Table {
    return this.db.getSchema().table(LfDocumentRepository.tableName)
  }

  constructor(deps: {lfDatabase: LfDatabase}) {
    this.lfDatabase = deps.lfDatabase
  }

  deleteDocument(id: string): void {
    const stmt = this.db
      .delete()
      .from(this.table)
      .where(this.table.id.eq(id.toString()))
    this.lfDatabase.txAttach(LfDocumentRepository.tableName, stmt)
  }

  async getDocument(id: string) {
    const records = (await this.db
      .select()
      .from(this.table)
      .where(this.table.id.eq(id))
      .exec()) as Document[]
    if (!records.length || !records[0]) return null
    return records[0]
  }

  async getDocuments(): Promise<Document[]> {
    const records = (await this.db
      .select()
      .from(this.table)
      .exec()) as Document[]

    return records
  }

  save(doc: Document): void {
    const row = this.table.createRow(doc)
    const stmt = this.db.insertOrReplace().into(this.table).values([row])
    this.lfDatabase.txAttach(LfDocumentRepository.tableName, stmt)
  }
}