import { timestamp } from "drizzle-orm/pg-core"

export const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deleted_at: timestamp("deleted_at"),
}
