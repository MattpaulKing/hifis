import { boolean, integer, jsonb, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { entities } from "./entities";
import { relations, sql } from "drizzle-orm";
import { entityFieldLayouts } from "./entityFieldLayouts";
import * as v from "valibot";
import type { Lookup } from "$src/lib/interfaces/Lookup";

export const entityFieldType = pgEnum("entity_field_type", ['input', 'lookup'])
export const entityInputType = pgEnum("entity_input_type", ['text', 'tel', 'date'])

export const entityFields = pgTable("entity_fields", {
  ...uuidPK,
  ...timestamps,
  entityId: uuid("entity_id").notNull().references(() => entities.id, { onUpdate: "cascade", onDelete: "restrict" }),
  fieldType: entityFieldType().notNull(),
  inputType: entityInputType(),
  multiple: boolean("multiple").notNull().default(false),
  label: text("label").notNull(),
  name: text("name").notNull(),
  placeholder: text("placeholder").default(""),
  required: boolean("required").default(false),
  min: integer("min"),
  max: integer("max"),
  inputOptions: jsonb("input_options").array().notNull().default(sql`'{}'::jsonb[]`).$type<Lookup[]>()
})
export const entityFieldsSchema = createInsertSchema(entityFields, {
  id: v.pipe(v.string(), v.uuid('UUID is badly formed.')),
  inputOptions: v.array(v.object({ id: v.string(), label: v.string() }))
})

export const entityFieldRelations = relations(entityFields, ({ one, many }) => ({
  entity: one(entities, { fields: [entityFields.entityId], references: [entities.id] }),
  layouts: many(entityFieldLayouts),
}))


