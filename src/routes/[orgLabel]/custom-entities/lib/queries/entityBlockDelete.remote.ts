import { getRequestEvent, query } from "$app/server"
import { entityBlockLayouts, entityBlocks, entityBlocksSchema } from "$src/schemas"
import { eq } from "drizzle-orm"
import type { FormData } from "$src/lib/interfaces/forms"

export const entityBlockDelete = query(entityBlocksSchema.entries.id, async (id: FormData<typeof entityBlocksSchema>['id']) => {
  let { locals: { db } } = getRequestEvent()
  await db
    .delete(entityBlockLayouts)
    .where(eq(entityBlockLayouts.blockId, id))
  await db
    .delete(entityBlocks)
    .where(eq(entityBlocks.id, id))
})
