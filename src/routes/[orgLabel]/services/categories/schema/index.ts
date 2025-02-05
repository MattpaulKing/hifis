import * as v from "valibot"
import { pgTable, text } from "drizzle-orm/pg-core";
import { uuidPK, timestamps } from "$src/schemas/helpers";
import { relations } from "drizzle-orm";
import { services } from "$src/schemas";

export const serviceCategories = pgTable('service_categories', {
  ...uuidPK,
  ...timestamps,
  label: text('label').notNull(),
  description: text("description"),
})

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services)
}))

export const serviceCategoriesFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  label: v.pipe(v.string("Service's name is required"), v.minLength(1, "Service's name is required")),
  description: v.pipe(v.string(), v.minLength(1, 'Description is required')),
})
