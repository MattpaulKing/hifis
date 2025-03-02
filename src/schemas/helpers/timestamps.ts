import { timestamp } from "drizzle-orm/pg-core"

const timestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}
export default timestamps

export function timestampsDefault() {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  }
}
