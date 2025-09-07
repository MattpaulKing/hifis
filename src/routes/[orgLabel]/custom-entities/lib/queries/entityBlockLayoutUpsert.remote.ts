import { getRequestEvent, query } from "$app/server"
import { entityBlockLayouts, entityBlockLayoutSchema } from "$src/schemas"
import { eq } from "drizzle-orm"
import type { FormData } from "$src/lib/interfaces/forms"

export const entityBlockLayoutUpsert = query(entityBlockLayoutSchema, async (layout: FormData<typeof entityBlockLayoutSchema>) => {
  let { locals: { db } } = getRequestEvent()
  let [layoutId] = await db
    .select({ id: entityBlockLayouts.id })
    .from(entityBlockLayouts)
    .where(eq(entityBlockLayouts.id, layout.id))
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


