import { tryQuery } from "../"
import type { PgTable } from "drizzle-orm/pg-core"
import type { DB } from "../client"

export default async function <T extends PgTable>({ rows, table, db }: { rows: T['$inferInsert'][], db: DB, table: T }) {
  return await tryQuery({
    fn: db
      .insert(table)
      .values(rows)
      .returning(),
    errorMsg: "Unable to insert."
  })
}
