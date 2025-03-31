import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { clients, serviceEvents, services } from "$src/schemas";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-valibot";

export const clientServiceEvents = pgTable("clients_service_events", {
  ...uuidPK,
  ...timestamps,
  serviceId: uuid("service_id").notNull().references(() => services.id, { onUpdate: "cascade", onDelete: "restrict" }),
  serviceEventId: uuid("service_event_id").notNull().references(() => serviceEvents.id, { onUpdate: "cascade", onDelete: "restrict" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onUpdate: "cascade", onDelete: "restrict" })
}, (t) => [
  unique('unique_meeting_id_client_id').on(t.clientId, t.serviceEventId)
])
export const clientServiceEventsRelations = relations(clientServiceEvents, ({ one }) => ({
  serviceEvents: one(serviceEvents, { fields: [clientServiceEvents.serviceEventId], references: [serviceEvents.id] }),
  clients: one(clients),
}))
export const clientServiceEventsSchema = createInsertSchema(clientServiceEvents)
