import * as v from "valibot"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { sql, type SQL } from "drizzle-orm";

export const clients = pgTable('clients', {
  ...uuidPK,
  ...timestamps,
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  label: text("label").generatedAlwaysAs((): SQL => sql`${clients.firstName}|| ' ' ||  ${clients.lastName}`).notNull(),
  dob: timestamp().notNull(),
  phone: text('phone'),
  email: text("email"),
})

export const clientContactFormSchema = v.object({
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
})
