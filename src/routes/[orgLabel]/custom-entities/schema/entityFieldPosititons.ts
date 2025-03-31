import { integer, pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { relations } from "drizzle-orm";
import { entityFields } from "./entityFields";

export const inputLayoutViewType = pgEnum("entity_form_view", ['xs', 'sm', 'md', 'lg', 'xl'])

export const entityFieldPositions = pgTable("entity_field_position", {
  ...uuidPK,
  ...timestamps,
  fieldId: uuid("field_id").notNull(),
  view: inputLayoutViewType(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  widthGridUnits: integer("width_grid_units").notNull(),
  heightGridUnits: integer("height_grid_units").notNull(),
})
export const entityFieldPositionSchema = createInsertSchema(entityFieldPositions)

export const entityFieldPositionRelations = relations(entityFieldPositions, ({ one }) => ({
  entityField: one(entityFields, { fields: [entityFieldPositions.fieldId], references: [entityFields.id] })
}))
