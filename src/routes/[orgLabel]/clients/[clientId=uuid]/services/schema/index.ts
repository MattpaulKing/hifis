import { clients, services } from "$src/schemas";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-valibot";

export const clientsServices = pgTable("clients_services", {
  ...uuidPK,
  ...timestamps,
  clientId: uuid("client_id").notNull().references(() => clients.id, { onUpdate: "cascade", onDelete: "restrict" }),
  serviceId: uuid("service_id").notNull().references(() => services.id, { onUpdate: "cascade", onDelete: "restrict" }),
  description: text("description").notNull()
}, (t) => [
  unique('unique_client_id_service_id').on(t.clientId, t.serviceId)
])

export const clientsServicesRelations = relations(clientsServices, ({ one }) => ({
  clients: one(clients, { fields: [clientsServices.clientId], references: [clients.id] }),
  services: one(services, { fields: [clientsServices.serviceId], references: [services.id] }),
}))

export const clientServiceSchema = createInsertSchema(clientsServices)
