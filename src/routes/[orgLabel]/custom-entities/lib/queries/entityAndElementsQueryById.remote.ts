import { getRequestEvent, query } from "$app/server"
import { tryQuery } from "$src/lib/server/db"
import { entities } from "$src/schemas"
import { eq } from "drizzle-orm"
import * as v from "valibot"

export const entityAndElementsQueryById = query(v.string(), async (id: string) => {
  let { locals: { db } } = getRequestEvent()
  let entity = await tryQuery({
    fn: db
      .query.entities.findFirst({
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
  console.dir(entity, { depth: null })
  return entity
})


