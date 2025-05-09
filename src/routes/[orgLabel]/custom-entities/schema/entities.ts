import { boolean, integer, pgTable, text, uuid, type AnyPgColumn } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { entityFields, entityFieldsSchema } from "./entityFields";
import { relations } from "drizzle-orm";
import { entityFieldLayoutSchema } from "./entityFieldLayouts";
import * as v from "valibot"

export const entities = pgTable("entities", {
  ...uuidPK,
  ...timestamps,
  version: integer("version").notNull(),
  published: boolean("published").default(false),
  label: text("label").notNull(),
  description: text("description"),
  parentId: uuid("parent_id").references((): AnyPgColumn => entities.id, { onUpdate: "cascade", onDelete: "restrict" })
})

export const entitySchema = v.object({
  ...createInsertSchema(entities).entries,
  fields: v.fallback(v.array(v.object({
    properties: entityFieldsSchema,
    layout: entityFieldLayoutSchema,
  })), []),
})

export const entityRelations = relations(entities, ({ one, many }) => ({
  parent: one(entities, { fields: [entities.parentId], references: [entities.id] }),
  fields: many(entityFields)
}))
