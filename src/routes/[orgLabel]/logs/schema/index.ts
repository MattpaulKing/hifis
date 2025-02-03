import * as v from "valibot"
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { services, clients } from "$src/schemas";

export const logs = pgTable("logs", {
  ...uuidPK,
  ...timestamps,
  note: text("note").notNull(),
})

export const logsRelations = pgTable("logs_relations", {
  ...uuidPK,
  ...timestamps,
  logId: uuid("log_id").notNull().references(() => logs.id, { onUpdate: "cascade", onDelete: "restrict" }),
  serviceId: uuid("service_id").references(() => services.id, { onUpdate: "cascade", onDelete: "restrict" }),
  clientId: uuid("client_id").references(() => clients.id, { onUpdate: "cascade", onDelete: "restrict" }),
})

export const logsFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  note: v.pipe(v.string(), v.minLength(2, "Note is required")),
  serviceIds: v.fallback(v.array(v.pipe(v.string(), v.uuid())), []),
  clientIds: v.fallback(v.array(v.pipe(v.string(), v.uuid())), [])
})
