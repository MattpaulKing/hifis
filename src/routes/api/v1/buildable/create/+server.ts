import { ar, validateForm } from "$src/lib/server/forms";
import { entities, entityFieldPositions, entityFields, entitySchema } from "$src/schemas";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { DB } from "$src/lib/server/db/client";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";

export const POST: RequestHandler = async (requestEvent) => {
  console.log('hit')
  let db = requestEvent.locals.db
  let data = await requestEvent.request.json()
  // const form = await validateForm({ requestEvent, schema: entitySchema })
  const form = await superValidate(data, valibot(entitySchema))
  console.log(form)
  if (!form.valid) return error(500)//ar.invalid({ form })
  let { fields = [], ...entity } = form.data
  let insertedEntity = await insertEntity({ entity, db })
  try {
    const insertedEntityFields = await db
      .insert(entityFields)
      .values(fields.map(({ properties }) => properties))
      .returning()
  } catch (e) {
    console.log(e)
    return error(500, 'error')
  }
  try {
    const insertedEntityPositions = await db
      .insert(entityFieldPositions)
      .values(fields.map(({ layout }) => layout))
      .returning()
  } catch (e) {
    console.log(e)
    return error(500, 'error')
  }
  // return ar.success({ form })
  return new Response()
}

async function insertEntity({ entity, db }: { entity: typeof entities.$inferInsert, db: DB }) {
  try {
    const [insertedEntity] = await db
      .insert(entities)
      .values(entity)
      .returning()
    return insertedEntity
  } catch (e) {
    console.log(e)
    return error(500, 'error')
  }
}
