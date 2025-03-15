import * as v from "valibot"
import { clients, services } from "$src/schemas";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const servicesReferrals = pgTable("services_referrals", {
  ...uuidPK,
  ...timestamps,
  clientId: uuid("client_id").notNull().references(() => clients.id, { onUpdate: "cascade", onDelete: "restrict" }),
  serviceId: uuid("service_id").notNull().references(() => services.id, { onUpdate: "cascade", onDelete: "restrict" }),
  status: text("status").notNull().default("pending"),
  description: text("description").notNull()
}, (t) => [
  unique('unique_client_id_service_id').on(t.clientId, t.serviceId)
])

export const servicesReferralsRelations = relations(servicesReferrals, ({ one }) => ({
  clients: one(clients, { fields: [servicesReferrals.clientId], references: [clients.id] }),
  services: one(services, { fields: [servicesReferrals.serviceId], references: [services.id] }),
}))

export const servicesReferralsFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  clientId: v.pipe(v.string(), v.uuid("Unable to find client")),
  serviceId: v.pipe(v.string(), v.uuid("Unable to find service")),
  status: v.nullable(v.pipe(v.string())),
  description: v.pipe(v.string(), v.trim(), v.minLength(1, "Description is required")),
})
