import type { FormData } from "$src/lib/interfaces/forms";
import { getRequestEvent, query } from "$app/server";
import { eq } from "drizzle-orm";
import { single, tryQuery } from "$src/lib/server/db";
import * as v from 'valibot'
import { entities, entityBlockLayouts, entityBlockLayoutSchema, entityBlocks, entityBlocksSchema, entityFieldLayouts, entityFieldLayoutSchema, entityFields, entityFieldsSchema, entitySchema } from "$src/schemas";

export const getEntity = query(v.string(), async (id: string) => {
  let { locals: { db } } = getRequestEvent()
  const entity = await db
    .select()
    .from(entities)
    .where(eq(entities.id, id))
    .limit(1)
    .then(single)
  return entity
})

export const getEntityAndElements = query(v.string(), async (id: string) => {
  let { locals: { db } } = getRequestEvent()
  let [entity] = await tryQuery({
    fn: db
      .query.entities.findMany({
        with: {
          fields: {
            with: {
              layouts: {},
            },
          },
          blocks: {
            with: {
              layouts: {},
            }
          }
        },
        where: eq(entities.id, id)
      }),
    errorMsg: "Entity not found"
  })
  return entity
})

export const entityFieldUpsert = query(entitySchema.entries.fields.item, async (field: FormData<typeof entitySchema>['fields'][0]) => {
  let { locals: { db } } = getRequestEvent()
  let fieldProps: Omit<typeof field, "layouts">
  let [fieldId] = await db
    .select({ id: entityFields.id })
    .from(entityFields)
    .where(eq(entityFields.id, field.id))
    .limit(1)
  if (!fieldId) {
    [fieldProps] = await db
      .insert(entityFields)
      .values(field)
      .returning()
    await db
      .insert(entityFieldLayouts)
      .values(Object.values(field.layouts))
  } else {
    [fieldProps] = await db
      .update(entityFields)
      .set(field)
      .where(eq(entityFields.id, field.id))
      .returning()
  }
  return {
    ...fieldProps,
    layouts: field.layouts
  }
})

export const entityBlockUpsert = query(entitySchema.entries.blocks.item, async (block: FormData<typeof entitySchema>['blocks'][0]) => {
  let { locals: { db } } = getRequestEvent()
  let blockProps: Omit<FormData<typeof entityBlocksSchema>, "layouts">
  let [blockId] = await db
    .select({ id: entityBlocks.id })
    .from(entityBlocks)
    .where(eq(entityBlocks.id, block.id))
    .limit(1)
  if (!blockId) {
    [blockProps] = await db
      .insert(entityBlocks)
      .values(block)
      .returning()
    await db
      .insert(entityBlockLayouts)
      .values(Object.values(block.layouts))
    return blockProps
  } else {
    [blockProps] = await db
      .update(entityBlocks)
      .set(block)
      .where(eq(entityFields.id, block.id))
    return {
      ...blockProps,
      layouts: block.layouts
    }
  }
})

export const entityFieldLayoutUpsert = query(entityFieldLayoutSchema, async (layout: FormData<typeof entityFieldLayoutSchema>) => {
  let { locals: { db } } = getRequestEvent()
  let [layoutId] = await db
    .select({ id: entityFieldLayouts.id })
    .from(entityFieldLayouts)
    .where(eq(entityFieldLayouts.id, layout.id))
    .limit(1)
  if (!layoutId) {
    return await db
      .insert(entityFieldLayouts)
      .values(layout)
      .returning()
  } else {
    return await db
      .update(entityFieldLayouts)
      .set(layout)
      .where(eq(entityFieldLayouts.id, layout.id))
      .returning()
  }
})

export const entityBlockLayoutUpsert = query(entityBlockLayoutSchema, async (layout: FormData<typeof entityBlockLayoutSchema>) => {
  let { locals: { db } } = getRequestEvent()
  let [layoutId] = await db
    .select({ id: entityFieldLayouts.id })
    .from(entityBlockLayouts)
    .where(eq(entityFieldLayouts.id, layout.id))
    .limit(1)
  if (!layoutId) {
    return await db
      .insert(entityBlockLayouts)
      .values(layout)
      .returning()
  } else {
    return await db
      .update(entityBlockLayouts)
      .set(layout)
      .where(eq(entityBlockLayouts.id, layout.id))
      .returning()
  }
})

export const entityFieldDelete = query(entityFieldsSchema.entries.id, async (id: FormData<typeof entityFieldsSchema>['id']) => {
  let { locals: { db } } = getRequestEvent()
  await db
    .delete(entityFieldLayouts)
    .where(eq(entityFieldLayouts.fieldId, id))
  await db
    .delete(entityFields)
    .where(eq(entityFields.id, id))
})

export const entityBlockDelete = query(entityBlocksSchema.entries.id, async (id: FormData<typeof entityBlocksSchema>['id']) => {
  let { locals: { db } } = getRequestEvent()
  await db
    .delete(entityBlockLayouts)
    .where(eq(entityBlockLayouts.blockId, id))
  await db
    .delete(entityFields)
    .where(eq(entityFields.id, id))
})
