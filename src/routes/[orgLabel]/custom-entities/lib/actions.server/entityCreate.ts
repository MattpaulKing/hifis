import { route } from "$src/lib/ROUTES"
import { insertAndReturn } from "$src/lib/server/db"
import { entities, entityBlockLayouts, entityBlocks, entityFieldLayouts, entityFields, type entitySchema } from "$src/schemas"
import { redirect } from "@sveltejs/kit"
import { ELEMENT_TYPES } from "../../schema/entityFields"
import type { FormValidated } from "$src/lib/interfaces"
import type { RequestEvent } from "../../[action=crud]/$types"

export default async function({ e, entity: _entity }: { e: RequestEvent, entity: FormValidated<typeof entitySchema>['data'] }) {
  let { locals: { db }, params: { orgLabel } } = e
  let { fieldInputs, fieldBlocks, ...entity } = _entity
  let [entityInserted] = await insertAndReturn({ rows: [entity], table: entities, db })
  await insertAndReturn({
    rows: fieldInputs
      .filter(({ properties }) => properties.elementType === ELEMENT_TYPES.FIELDS)
      .map(({ properties }) => ({ ...properties, entityId: entityInserted.id })),
    table: entityFields,
    db
  })
  await insertAndReturn({ rows: fieldInputs.map(({ layout }) => layout), table: entityFieldLayouts, db })
  await insertAndReturn({
    rows: fieldBlocks
      .filter(({ properties }) => properties.elementType === ELEMENT_TYPES.FIELDS)
      .map(({ properties }) => ({ ...properties, entityId: entityInserted.id })),
    table: entityBlocks,
    db
  })
  await insertAndReturn({ rows: fieldBlocks.map(({ layout }) => layout), table: entityBlockLayouts, db })
  return redirect(302, `${route('/[orgLabel]/custom-entities/[action=crud]', {
    orgLabel,
    action: 'update'
  })}?entityId=${entity.id}`)
}
