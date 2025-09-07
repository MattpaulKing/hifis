import { getRequestEvent, query } from "$app/server"
import { entityBlockLayouts, entityBlocks, entityBlocksSchema, entitySchema } from "$src/schemas"
import { eq } from "drizzle-orm"
import type { FormData } from "$src/lib/interfaces/forms"

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
      .where(eq(entityBlocks.id, block.id))
    return {
      ...blockProps,
      layouts: block.layouts
    }
  }
})


