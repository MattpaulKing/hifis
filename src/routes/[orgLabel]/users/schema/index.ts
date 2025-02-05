import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { organizations } from "$src/schemas";
import { uuidPK, timestamps } from "$src/schemas/helpers";
import * as v from "valibot"
import { relations } from "drizzle-orm";

export const users = pgTable('users', {
  ...uuidPK,
  ...timestamps,
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: varchar('phone', { length: 256 }),
  email: text("email").notNull(),
  orgId: uuid("organization_id").references(() => organizations.id).notNull()
});

export const usersRelations = relations(users, ({ many, one }) => ({
  organizations: many(organizations)
}))

export const usersFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  firstName: v.pipe(v.string(), v.trim(), v.minLength(1, "First Name is required")),
  lastName: v.pipe(v.string(), v.trim(), v.minLength(1, "Last Name is required")),
  phone: v.nullable(v.pipe(v.string(), v.trim())),
  email: v.pipe(v.string(), v.email()),
  orgId: v.pipe(v.string(), v.uuid())
})
