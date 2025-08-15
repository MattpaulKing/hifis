import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { relations } from "drizzle-orm";
import { entityFields } from "./entityFields";
import { layoutViewsEnum } from "./entityFieldLayouts";
import { entityBlocks } from "./entityBlocks";
import * as v from "valibot"

export const entityBlockLayouts = pgTable("entity_block_layouts", {
  ...uuidPK,
  ...timestamps,
  blockId: uuid("field_id").notNull().references(() => entityFields.id, { onUpdate: "cascade", onDelete: "cascade" }),
  view: layoutViewsEnum().notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  widthGridUnits: integer("width_grid_units").notNull(),
  heightGridUnits: integer("height_grid_units").notNull(),
})
export const entityBlockLayoutSchema = createInsertSchema(entityBlockLayouts, {
  id: v.pipe(v.string(), v.uuid()),
  x: v.pipe(v.number(), v.minValue(0), v.maxValue(10000)),
  y: v.pipe(v.number(), v.minValue(0), v.maxValue(10000)),
  widthGridUnits: v.pipe(v.number(), v.minValue(1), v.maxValue(100)),
  heightGridUnits: v.pipe(v.number(), v.minValue(1), v.maxValue(100)),
})

export const entityBlockLayoutRelations = relations(entityBlockLayouts, ({ one }) => ({
  blocks: one(entityBlocks, { fields: [entityBlockLayouts.blockId], references: [entityBlocks.id] })
}))
