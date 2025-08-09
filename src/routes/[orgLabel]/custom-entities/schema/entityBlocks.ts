import { timestamps, uuidPK } from "$src/schemas/helpers";
import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { entities } from "./entities";
import { entityElementFieldType } from "./entityFields";
import { createInsertSchema } from "drizzle-valibot";
import { relations } from "drizzle-orm";
import { entityBlockLayouts } from "./entityBlockLayouts";
import * as v from 'valibot'


export const entityBlockType = pgEnum("entity_block_type", ['textBlock', 'dividerHorizontal', 'dividerVertical'])

export const entityBlocks = pgTable("entity_blocks", {
  ...uuidPK,
  ...timestamps,
  entityId: uuid("entity_id").notNull().references(() => entities.id, { onUpdate: "cascade", onDelete: "restrict" }),
  elementType: entityElementFieldType().notNull().default("blocks"),
  fieldType: entityBlockType().notNull(),
  size: text("size").notNull().default("base"),
  color: text("color"),
  textValue: text("text_value").notNull().default(''),
})

export const entityBlocksSchema = createInsertSchema(entityBlocks, {
  id: v.pipe(v.string(), v.uuid('UUID is badly formed.')),
})

export const entityBlocksRelations = relations(entityBlocks, ({ one, many }) => ({
  entity: one(entities, { fields: [entityBlocks.entityId], references: [entities.id], relationName: "fieldBlocks" }),
  layouts: many(entityBlockLayouts)
}))
