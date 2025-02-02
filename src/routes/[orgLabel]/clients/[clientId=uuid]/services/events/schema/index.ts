import * as v from "valibot"
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { clients, serviceEvents } from "$src/schemas";

export const clientsServiceEvents = pgTable("clients_service_events", {
  ...uuidPK,
  ...timestamps,
  serviceEventId: uuid("service_event_id").notNull().references(() => serviceEvents.id, { onUpdate: "cascade", onDelete: "restrict" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onUpdate: "cascade", onDelete: "restrict" })
}, (t) => [{
  uniqueConstraint: unique('unique_meeting_id_client_id').on(t.clientId, t.serviceEventId)
}])

export const clientsServiceEventsFormSchema = v.object({
  serviceEventId: v.pipe(v.string(), v.uuid("Could not find meeting")),
  clientId: v.pipe(v.string(), v.uuid("Could not find client"))
})
