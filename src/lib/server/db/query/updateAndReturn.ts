import { error } from "@sveltejs/kit"
import { and, SQL } from "drizzle-orm"
import type { PgTable } from "drizzle-orm/pg-core"
import type { DB } from "../client"

export default async function <T extends PgTable>({ rows, table, db, filters }: { rows: T['$inferInsert'][], db: DB, table: T, filters: SQL[] }) {
  try {
    const updatedRows = await db
      .update(table)
      .set(rows)
      .where(and(...filters))
    return updatedRows
  } catch (e) {
    console.log(e)
    return error(500, 'error')
  }
}
