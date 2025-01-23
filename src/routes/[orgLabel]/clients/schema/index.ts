import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../../../../schemas/helpers/timestamps";
import { organizations } from "../../schema";
import * as v from "valibot"

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  ...timestamps,
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dob: timestamp().notNull(),
  phone: text('phone'),
  email: text("email"),
  orgId: uuid("organization_id").references(() => organizations.id).notNull()
})

export const clientsFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  firstName: v.pipe(v.string(), v.trim(), v.minLength(1, "First Name is required")),
  lastName: v.pipe(v.string(), v.trim(), v.minLength(1, "Last Name is required")),
  dob: v.pipe(
    v.date("Date is required"),
    v.maxValue(
      new Date(
        new Date().getFullYear() - 18,
        new Date().getMonth(),
        new Date().getDate()
      ), 'Client must be at least 18 years old')),
  phone: v.nullable(v.pipe(v.string(), v.trim())),
  email: v.nullable(v.pipe(v.string(), v.email())),
  orgId: v.pipe(v.string(), v.uuid())
})
