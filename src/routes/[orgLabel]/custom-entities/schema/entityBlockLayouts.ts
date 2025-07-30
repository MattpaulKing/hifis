import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot"
import { relations } from "drizzle-orm";
import { entityFields } from "./entityFields";
import { inputLayoutViewType } from "./entityFieldLayouts";
import { entityBlocks } from "./entityBlocks";
import * as v from "valibot"

export const entityBlockLayouts = pgTable("entity_block_layouts", {
  ...uuidPK,
  ...timestamps,
  blockId: uuid("field_id").notNull().references(() => entityFields.id, { onUpdate: "cascade", onDelete: "cascade" }),
  view: inputLayoutViewType().notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  widthGridUnits: integer("width_grid_units").notNull(),
  heightGridUnits: integer("height_grid_units").notNull(),
})
export const entityBlockLayoutSchema = createInsertSchema(entityBlockLayouts, {
  id: v.pipe(v.string(), v.uuid())
})

export const entityBlockLayoutRelations = relations(entityBlockLayouts, ({ one }) => ({
  blocks: one(entityBlocks, { fields: [entityBlockLayouts.blockId], references: [entityBlocks.id] })
}))
