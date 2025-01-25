import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { timestamps } from "../../../../../schemas/helpers/timestamps";
import * as v from "valibot"

export const serviceCategories = pgTable('service_categories', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  ...timestamps,
  label: text('label').notNull(),
  description: text("description"),
})

export const serviceCategoriesFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  label: v.pipe(v.string("Service's name is required"), v.minLength(1, "Service's name is required")),
  description: v.pipe(v.string(), v.minLength(1, 'Description is required')),
})
