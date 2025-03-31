import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { services } from "$src/schemas";
import { createInsertSchema } from "drizzle-valibot";

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

export const serviceEventsSchema = createInsertSchema(serviceEvents)
