import { integer, pgEnum, pgTable, text, uuid, type AnyPgColumn } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { entityFields } from "./entityFields";
import { relations } from "drizzle-orm";

export const entities = pgTable("entities", {
  ...uuidPK,
  ...timestamps,
  version: integer("version").notNull(),
  label: text("label").notNull(),
  parentId: uuid("parent_id").notNull().references((): AnyPgColumn => entities.id, { onUpdate: "cascade", onDelete: "restrict" })
})

export const entitySchema = createInsertSchema(entities)

export const entityRelations = relations(entities, ({ one, many }) => ({
  parent: one(entities, { fields: [entities.parentId], references: [entities.id] }),
  fields: many(entityFields)
}))
