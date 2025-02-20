import * as v from "valibot"
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { services, clients } from "$src/schemas";
import { relations } from "drizzle-orm";


export const logCategories = pgTable("log_categories", {
  ...uuidPK,
  ...timestamps,
  label: text("label").notNull(),
  description: text("description").notNull()
})

export const logCategoriesFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  label: v.pipe(v.string(), v.minLength(2, "Category label is required")),
  description: v.pipe(v.string(), v.minLength(2, "Description is required")),
})

export const logs = pgTable("logs", {
  ...uuidPK,
  ...timestamps,
  categoryId: uuid("category_id").notNull().references(() => logCategories.id, { onUpdate: "cascade", onDelete: "cascade" }),
  note: text("note").notNull(),
})

export const logsClients = pgTable("logs_clients", {
  ...uuidPK,
  logId: uuid("log_id").notNull().references(() => logs.id, { onUpdate: "cascade", onDelete: "restrict" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onUpdate: "cascade", onDelete: "restrict" }),
})

export const logsServices = pgTable("logs_services", {
  ...uuidPK,
  logId: uuid("log_id").notNull().references(() => logs.id, { onUpdate: "cascade", onDelete: "restrict" }),
  serviceId: uuid("service_id").notNull().references(() => services.id, { onUpdate: "cascade", onDelete: "restrict" }),
})

export const logsRelations = relations(logs, ({ many }) => ({
  logsClients: many(logsClients),
  logsServices: many(logsServices),
}))

export const logsClientsRelations = relations(logsClients, ({ one }) => ({
  logs: one(logs, { fields: [logsClients.logId], references: [logs.id] }),
  clients: one(clients, { fields: [logsClients.clientId], references: [clients.id] }),
}))

export const logsServicesRelations = relations(logsServices, ({ one }) => ({
  logs: one(logs, { fields: [logsServices.logId], references: [logs.id] }),
  services: one(services, { fields: [logsServices.serviceId], references: [services.id] }),
}))

export const logsFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  categoryId: v.pipe(v.string(), v.minLength(2, "Category is required")),
  note: v.pipe(v.string(), v.minLength(2, "Note is required")),
  serviceIds: v.fallback(v.array(v.pipe(v.string(), v.uuid())), []),
  clientIds: v.fallback(v.array(v.pipe(v.string(), v.uuid())), [])
})
