import * as v from "valibot"
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { services } from "$src/schemas";

export const serviceEvents = pgTable("service_events", {
  ...uuidPK,
  ...timestamps,
  label: text("label").notNull(),
  spaces: integer("spaces").notNull(),
  startTS: timestamp("start_ts").notNull(),
  endTS: timestamp("end_ts").notNull(),
  description: text("description"),
  serviceId: uuid("service_id").notNull().references(() => services.id, { onUpdate: "cascade", onDelete: "restrict" }),
})

export const serviceEventsFormSchema = v.object({
  id: v.fallback(v.pipe(v.string(), v.uuid()), crypto.randomUUID()),
  label: v.pipe(v.string(), v.trim(), v.minLength(1, "Label is required")),
  spaces: v.pipe(v.number(), v.integer("Expected number"), v.minValue(0, "Must be greater than 0")),
  startTS: v.pipe(v.date("Start date is required")),
  endTS: v.pipe(v.date("End date is required")),
  description: v.nullable(v.string()),
  serviceId: v.pipe(v.string(), v.uuid("Unable to find service"))
})
