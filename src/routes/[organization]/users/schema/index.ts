import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../../../schemas/helpers/timestamps";
import { organizations } from "../../schema";
import * as v from "valibot"

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  ...timestamps,
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: varchar('phone', { length: 256 }),
  email: text("email").notNull(),
  orgId: uuid("organization_id").references(() => organizations.id).notNull()
});

export const usersInsertSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  firstName: v.pipe(v.string(), v.trim()),
  lastName: v.pipe(v.string(), v.trim()),
  phone: v.nullable(v.pipe(v.string(), v.trim())),
  email: v.pipe(v.string(), v.email()),
  orgId: v.pipe(v.string(), v.uuid())
})
