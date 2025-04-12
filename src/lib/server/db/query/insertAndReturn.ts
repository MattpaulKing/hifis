import type { PgTable } from "drizzle-orm/pg-core"
import type { DB } from "../client"
import { error } from "@sveltejs/kit"

export default async function <T extends PgTable>({ rows, table, db }: { rows: T['$inferInsert'][], db: DB, table: T }) {
  try {
    const insertedRows = await db
      .insert(table)
      .values(rows)
      .returning()
    console.log(insertedRows)
    return insertedRows
  } catch (e) {
    console.log(e)
    return error(500, 'error')
  }
}
