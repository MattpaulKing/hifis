import type { FormData } from "$src/lib/interfaces/forms";
import { getRequestEvent, query } from "$app/server";
import { eq } from "drizzle-orm";
import { entities, entitySchema } from "./entities";
import { single } from "$src/lib/server/db";
import { entityFieldLayouts, entityFieldLayoutSchema } from "./entityFieldLayouts";
import { entityFields, entityFieldsSchema } from "./entityFields";
import * as v from 'valibot'
import { entityBlocks } from "./entityBlocks";
import { entityBlockLayouts } from "./entityBlockLayouts";

export const getEntity = query(v.string(), async (id: string) => {
  let { locals: { db } } = getRequestEvent()
  const entity = await db.select().from(entities).where(eq(entities.id, id)).limit(1).then(single)
  return entity
})

export const entityFieldUpsert = query(entitySchema.entries.fieldInputs.item, async (field: FormData<typeof entitySchema>['fieldInputs'][0]) => {
  let { locals: { db } } = getRequestEvent()
  let [fieldId] = await db
    .select({ id: entityFields.id })
    .from(entityFields)
    .where(eq(entityFields.id, field.properties.id))
    .limit(1)
  if (!fieldId) {
    await db
      .insert(entityFields)
      .values(field.properties)
    await db
      .insert(entityFieldLayouts)
      .values(field.layout)
    return
  } else {
    await db
      .update(entityFields)
      .set(field.properties)
      .where(eq(entityFields.id, field.properties.id))
      .returning()
    return
  }
})

export const entityBlockUpsert = query(entitySchema.entries.fieldBlocks.item, async (block: FormData<typeof entitySchema>['fieldBlocks'][0]) => {
  let { locals: { db } } = getRequestEvent()
  let [blockId] = await db
    .select({ id: entityFields.id })
    .from(entityBlocks)
    .where(eq(entityBlocks.id, block.properties.id))
    .limit(1)
  if (!blockId) {
    await db
      .insert(entityBlocks)
      .values(block.properties)
    await db
      .insert(entityBlockLayouts)
      .values(block.layout)
    return
  } else {
    await db
      .update(entityBlocks)
      .set(block.properties)
      .where(eq(entityFields.id, block.properties.id))
    return
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
    let [layoutInserted] = await db
      .insert(entityFieldLayouts)
      .values(layout)
      .returning()
    return layoutInserted
  } else {
    let [layoutUpdated] = await db
      .update(entityFieldLayouts)
      .set(layout)
      .where(eq(entityFieldLayouts.id, layout.id))
      .returning()
    return layoutUpdated
  }
})

export const entityFieldDelete = query(entityFieldsSchema.entries.id, async (id: FormData<typeof entityFieldsSchema>['id']) => {
  let { locals: { db } } = getRequestEvent()
  await db
    .delete(entityFields)
    .where(eq(entityFields.id, id))
})
