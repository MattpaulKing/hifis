import { route } from "$src/lib/ROUTES"
import { insertAndReturn } from "$src/lib/server/db"
import { entities, entityFieldLayouts, entityFields, type entitySchema } from "$src/schemas"
import { redirect } from "@sveltejs/kit"
import type { FormValidated } from "$src/lib/interfaces"
import type { RequestEvent } from "../../[action=crud]/$types"

export default async function({ e, entity: _entity }: { e: RequestEvent, entity: FormValidated<typeof entitySchema>['data'] }) {
  let { locals: { db }, params: { orgLabel } } = e
  let { fields, ...entity } = _entity
  let [entityInserted] = await insertAndReturn({ rows: [entity], table: entities, db })
  await insertAndReturn({ rows: fields.map(({ properties }) => ({ ...properties, entityId: entityInserted.id })), table: entityFields, db })
  await insertAndReturn({ rows: fields.map(({ layout }) => layout), table: entityFieldLayouts, db })
  return redirect(302, `${route('/[orgLabel]/custom-entities/[action=crud]', {
    orgLabel,
    action: 'update'
  })}?entityId=${entity.id}`)
}
