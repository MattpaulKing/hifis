import { getRequestEvent, query } from "$app/server"
import { entityFieldLayouts, entityFieldLayoutSchema } from "$src/schemas"
import { eq } from "drizzle-orm"
import type { FormData } from "$src/lib/interfaces/forms"

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


