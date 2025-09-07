import { getRequestEvent, query } from "$app/server"
import { single } from "$src/lib/server/db"
import { entities } from "$src/schemas"
import { eq } from "drizzle-orm"
import * as v from "valibot"

export const entityQueryById = query(v.string(), async (id: string) => {
  let { locals: { db } } = getRequestEvent()
  const entity = await db
    .select()
    .from(entities)
    .where(eq(entities.id, id))
    .limit(1)
    .then(single)
  return entity
})
