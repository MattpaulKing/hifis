import * as v from "valibot"
import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { relations } from "drizzle-orm";
import { services, users } from "$src/schemas";

export const organizations = pgTable("organizations", {
  ...uuidPK,
  ...timestamps,
  label: text("label").notNull(),
  email: text("email").notNull(),
})

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  services: many(services),
  users: many(users)
}))

export const organizationInsertSchema = v.object({
  label: v.pipe(v.string("Name is required"), v.minLength(2, "Name must be at least 2 characters")),
  email: v.pipe(v.string('Email is required'), v.email("Invalid email"))
})
