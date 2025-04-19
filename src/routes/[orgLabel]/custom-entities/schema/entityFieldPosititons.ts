import { integer, pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { relations } from "drizzle-orm";
import { entityFields } from "./entityFields";

export const inputLayoutViewType = pgEnum("entity_form_view", ['xs', 'sm', 'md', 'lg', 'xl'])

export const entityFieldLayouts = pgTable("entity_field_layouts", {
  ...uuidPK,
  ...timestamps,
  fieldId: uuid("field_id").notNull().references(() => entityFields.id, { onUpdate: "cascade", onDelete: "restrict" }),
  view: inputLayoutViewType().notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  widthGridUnits: integer("width_grid_units").notNull(),
  heightGridUnits: integer("height_grid_units").notNull(),
})
export const entityFieldLayoutSchema = createInsertSchema(entityFieldLayouts)

export const entityFieldLayoutRelations = relations(entityFieldLayouts, ({ one }) => ({
  entityField: one(entityFields, { fields: [entityFieldLayouts.fieldId], references: [entityFields.id] })
}))
