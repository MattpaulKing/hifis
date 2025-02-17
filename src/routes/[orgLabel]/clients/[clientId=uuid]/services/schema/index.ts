import * as v from "valibot"
import { clients, services } from "$src/schemas";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

export const clientServiceFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  clientId: v.pipe(v.string(), v.uuid("Unable to find client")),
  serviceId: v.pipe(v.string(), v.uuid("Unable to find service")),
  description: v.pipe(v.string(), v.trim(), v.minLength(1, "Description is required")),
})
