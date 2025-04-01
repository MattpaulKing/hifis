import { boolean, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { entities } from "./entities";
import { relations } from "drizzle-orm";
import { entityFieldPositions } from "./entityFieldPosititons";

export const entityFieldType = pgEnum("entity_field_type", ['input', 'lookup'])
export const entityInputType = pgEnum("entity_field_type", ['text', 'tel', 'date'])

export const entityFields = pgTable("entity_fields", {
  ...uuidPK,
  ...timestamps,
  entityId: uuid("entity_id").notNull(),
  fieldType: entityFieldType(),
  inputType: entityInputType(),
  multiple: boolean("multiple").notNull().default(false),
  label: text("label").notNull(),
  name: text("name").notNull(),
  placeholder: text("placeholder").default(""),
  required: boolean("required").default(false),
  min: integer("min"),
  max: integer("max"),
})
export const entityFieldSchema = createInsertSchema(entityFields)

export const entityFieldRelations = relations(entityFields, ({ one, many }) => ({
  entity: one(entities, { fields: [entityFields.entityId], references: [entities.id] }),
  positions: many(entityFieldPositions)
}))


