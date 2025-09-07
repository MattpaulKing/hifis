import { integer, pgTable } from "drizzle-orm/pg-core";
import { entityFieldType } from "./entityFields";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { createInsertSchema } from "drizzle-valibot";

export const entityFieldLayoutMetaData = pgTable("entity_field_layout_metadata", {
  ...uuidPK,
  ...timestamps,
  version: integer("version").notNull(),
  entityFieldType: entityFieldType("entity_field_type").notNull(),
  minWidthGridUnits: integer("min_width_grid_units").notNull(),
  minHeightGridUnits: integer("min_height_grid_units").notNull(),
})

export const entityFieldLayoutMetaDataSchema = createInsertSchema(entityFieldLayoutMetaData)
