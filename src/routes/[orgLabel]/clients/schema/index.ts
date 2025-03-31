import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { relations, sql, type SQL } from "drizzle-orm";
import { logs, services } from "$src/schemas";
import { createInsertSchema } from "drizzle-valibot";

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
export const clientsRelations = relations(clients, ({ many }) => ({
  services: many(services),
  logs: many(logs)
}))
export const clientContactSchema = createInsertSchema(clients)
