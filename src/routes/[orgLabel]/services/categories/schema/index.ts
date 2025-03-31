import { pgTable, text } from "drizzle-orm/pg-core";
import { uuidPK, timestamps } from "$src/schemas/helpers";
import { relations } from "drizzle-orm";
import { services } from "$src/schemas";
import { createInsertSchema } from "drizzle-valibot";

export const serviceCategories = pgTable('service_categories', {
  ...uuidPK,
  ...timestamps,
  label: text('label').notNull(),
  description: text("description"),
})
export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services)
}))
export const serviceCategoriesSchema = createInsertSchema(serviceCategories)
