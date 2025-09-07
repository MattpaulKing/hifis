import { integer, pgTable } from "drizzle-orm/pg-core";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { entityBlockType } from "./entityBlocks";
import { createInsertSchema } from "drizzle-valibot";

export const entityBlockLayoutMetaData = pgTable("entity_block_layout_metadata", {
  ...uuidPK,
  ...timestamps,
  version: integer("version").notNull(),
  entityBlockType: entityBlockType("entity_block_type").notNull(),
  minWidthGridUnits: integer("min_width_grid_units").notNull(),
  minHeightGridUnits: integer("min_height_grid_units").notNull(),
})

export const entityBlockLayoutMetaDataSchema = createInsertSchema(entityBlockLayoutMetaData)
