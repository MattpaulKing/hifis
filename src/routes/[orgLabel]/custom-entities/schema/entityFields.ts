import { boolean, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { entities } from "./entities";
import { relations } from "drizzle-orm";
import { entityFieldPositions } from "./entityFieldPosititons";
import * as v from "valibot"

export const entityFieldType = pgEnum("entity_field_type", ['text', 'tel', 'date'])

export const entityFields = pgTable("entity_fields", {
  ...uuidPK,
  ...timestamps,
  entityId: uuid("entity_id").notNull(),
  inputType: entityFieldType(),
  label: text("label").notNull(),
  name: text("name").notNull(),
  placeholder: text("placeholder").default(""),
  required: boolean("required").default(false),
  min: integer("min"),
  max: integer("max"),
})
export const entityFieldSchema = v.object({
  entityId: v.pipe(v.string(), v.uuid()),
  label: v.pipe(v.string(), v.minLength(1)),
  fields: v.array(v.object({
    ...createInsertSchema(entityFields).entries
  })),
  previewField: createInsertSchema(entityFields)
})

export const entityFieldRelations = relations(entityFields, ({ one, many }) => ({
  entity: one(entities, { fields: [entityFields.entityId], references: [entities.id] }),
  positions: many(entityFieldPositions)
}))


