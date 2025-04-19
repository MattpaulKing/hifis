import { route } from "$src/lib/ROUTES"
import { insertAndReturn, tryQuery, updateAndReturn } from "$src/lib/server/db"
import { entities, entityFieldLayouts, entityFields, type entitySchema } from "$src/schemas"
import { error } from "@sveltejs/kit"
import { eq } from "drizzle-orm"
import type { FormValidated } from "$src/lib/interfaces"
import type { RequestEvent } from "../../[action=crud]/$types"

export default async function({ e, entity: _entity }: { e: RequestEvent, entity: FormValidated<typeof entitySchema>['data'] }) {
  let { locals: { db }, params: { orgLabel } } = e
  let { fields, ...entity } = _entity
  if (!entity.id) return error(404, "Entity not found")
  await updateAndReturn({ db, rows: [entity], table: entities, filters: [eq(entities.id, entity.id)] })
  let entityFieldRows = await tryQuery({
    fn: db
      .select()
      .from(entityFields)
      .where(eq(entityFields.entityId, entity.id)),
    errorMsg: "No entity fields found"
  })
  let rows = {
    update: fields.filter(({ properties: { id } }) => entityFieldRows.some((row) => row.id === id)),
    insert: fields.filter(({ properties: { id } }) => !entityFieldRows.some((row) => row.id === id)),
  }
  insertAndReturn({ db, table: entityFields, rows: rows.insert })
}
