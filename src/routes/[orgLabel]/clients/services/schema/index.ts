import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "../../../../../schemas/helpers";
import { clients } from "../../schema";
import { services } from "../../../services/schema";
import * as v from "valibot"

export const clientsServices = pgTable("clients_services", {
  ...uuidPK,
  ...timestamps,
  clientId: uuid("client_id").notNull().references(() => clients.id, { onUpdate: "cascade", onDelete: "restrict" }),
  serviceId: uuid("service_id").notNull().references(() => services.id, { onUpdate: "cascade", onDelete: "restrict" }),
  description: text("description").notNull()
})

export const clientsServicesFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  clientId: v.pipe(v.string(), v.uuid("Unable to find client")),
  serviceId: v.pipe(v.string(), v.uuid("Unable to find service")),
  description: v.pipe(v.string(), v.trim(), v.minLength(1, "Description is required")),
})
