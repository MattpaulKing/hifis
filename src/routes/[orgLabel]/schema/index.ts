import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { relations } from "drizzle-orm";
import { services, users } from "$src/schemas";
import { createInsertSchema } from "drizzle-valibot";

export const organizations = pgTable("organizations", {
  ...uuidPK,
  ...timestamps,
  label: text("label").notNull(),
  email: text("email").notNull(),
})

export const organizationsRelations = relations(organizations, ({ many }) => ({
  services: many(services),
  users: many(users)
}))
export const organizationsSchema = createInsertSchema(organizations)
