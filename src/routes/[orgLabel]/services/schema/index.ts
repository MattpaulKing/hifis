import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { clients, logs, organizations, serviceEvents } from "$src/schemas";
import { uuidPK, timestamps } from "$src/schemas/helpers";
import { serviceCategories } from "$src/schemas";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-valibot";

export const services = pgTable('services', {
  ...uuidPK,
  ...timestamps,
  label: text('label').notNull(),
  address: text('address').notNull(),
  phone: text('phone'),
  email: text("email"),
  categoryId: uuid("category_id").notNull().references(() => serviceCategories.id, { onUpdate: "cascade", onDelete: "restrict" }),
  description: text("description"),
  orgId: uuid("organization_id").references(() => organizations.id, { onUpdate: "cascade", onDelete: "restrict" }).notNull()
})

export const servicesSchema = createInsertSchema(services)

export const servicesRelations = relations(services, ({ one, many }) => ({
  organizations: one(organizations, { fields: [services.orgId], references: [organizations.id] }),
  serviceCategories: one(serviceCategories, { fields: [services.categoryId], references: [serviceCategories.id] }),
  serviceEvents: many(serviceEvents),
  logs: many(logs),
  clients: many(clients)
}))
