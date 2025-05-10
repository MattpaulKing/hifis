import { and, SQL } from "drizzle-orm"
import { tryQuery } from "../"
import type { PgTable } from "drizzle-orm/pg-core"
import type { DB } from "../client"

export default async function <T extends PgTable>({ rows, table, db, filters }: { rows: T['$inferInsert'][], db: DB, table: T, filters: SQL[] }) {
  return await tryQuery({
    fn: db
      .update(table)
      .set(rows)
      .where(and(...filters))
      .returning(),
    errorMsg: "Something went wrong"
  })
}
