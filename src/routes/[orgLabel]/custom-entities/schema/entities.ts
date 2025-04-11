import { boolean, integer, pgTable, text, uuid, type AnyPgColumn } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { entityFields, entityFieldSchema } from "./entityFields";
import { relations } from "drizzle-orm";
import * as v from "valibot"
import { entityFieldPositionSchema } from "./entityFieldPosititons";

export const entities = pgTable("entities", {
  ...uuidPK,
  ...timestamps,
  version: integer("version").notNull(),
  published: boolean("published").default(false),
  label: text("label").notNull(),
  parentId: uuid("parent_id").references((): AnyPgColumn => entities.id, { onUpdate: "cascade", onDelete: "restrict" })
})

export const entitySchema = v.object({
  ...createInsertSchema(entities).entries,
  fields: v.array(v.object({
    properties: entityFieldSchema,
    layout: entityFieldPositionSchema
  })),
})

export const entityRelations = relations(entities, ({ one, many }) => ({
  parent: one(entities, { fields: [entities.parentId], references: [entities.id] }),
  fields: many(entityFields)
}))
