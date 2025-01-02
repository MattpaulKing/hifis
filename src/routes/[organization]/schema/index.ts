import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../../../schemas/helpers/timestamps";
import * as v from "valibot"

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  ...timestamps,
  label: text("label").notNull(),
  email: text("email").notNull(),
})

export const organizationInsertSchema = v.object({
  label: v.pipe(v.string("Name is required"), v.minLength(2, "Name must be at least 2 characters")),
  email: v.pipe(v.string('Email is required'), v.email("Invalid email"))
})
