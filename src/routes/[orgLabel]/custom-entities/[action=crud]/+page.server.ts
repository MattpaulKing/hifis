import { eq } from "drizzle-orm"
import { superValidate } from "sveltekit-superforms"
import { entities, entityFieldPositions, entityFields, entityFieldSchema, entitySchema, users } from "$src/schemas"
import { valibot } from "sveltekit-superforms/adapters"
import { ar, validateForm } from "$src/lib/server/forms"
import { error, redirect } from "@sveltejs/kit"
import { insertAndReturn } from "$src/lib/server/db"
import { route } from "$src/lib/ROUTES"
import type { DB } from "$src/lib/server/db/client"
import type { Actions, PageServerLoad } from "./$types"
import type { TabEntity } from "$src/lib/components/user-grid"
import type { FormValidated } from "$src/lib/interfaces"

type SearchParams = {
  entityId?: string
}

export const load: PageServerLoad = async ({ url, params: { action }, locals: { db, subject } }) => {
  let searchParams: SearchParams = Object.fromEntries(url.searchParams)
  let entityId = searchParams.entityId ?? crypto.randomUUID()
  return {
    action,
    entityId,
    entityForm: await getEntityFormValidated({ entityId, db }),
    entityFieldsForm: await superValidate({
      entityId,
    }, valibot(entityFieldSchema), { errors: false }),
    orgsUsers: await db
      .select()
      .from(users)
      .where(eq(users.orgId, subject.properties.orgId))
  }
}

export const actions = {
  default: async (e) => {
    let { locals: { db } } = e
    const form = await validateForm({ requestEvent: e, schema: entitySchema })
    if (!form.valid) return ar.invalid({ form })
    let { fields = [], ...entity } = form.data
    if (e.params.action === 'create') {
      let [entityInserted] = await insertAndReturn({ rows: [entity], table: entities, db })
      await insertAndReturn({ rows: fields.map(({ properties }) => ({ ...properties, entityId: entityInserted.id })), table: entityFields, db })
      await insertAndReturn({ rows: fields.map(({ layout }) => layout), table: entityFieldPositions, db })
      return redirect(302, `${route('/[orgLabel]/custom-entities/[action=crud]', {
        orgLabel: e.params.orgLabel,
        action: 'update'
      })}?entityId=${entity.id}`)
    } else if (e.params.action === 'update') {
      //TODO: update entity -> then check if fields / positions exist and update or add depending on result
    }
    return ar.success({ form })
  }
} satisfies Actions

async function getEntityFormValidated({ entityId, db }: { entityId: string | undefined, db: DB }) {
  let entityFormData: FormValidated<typeof entitySchema>['data']
  if (!entityId) {
    entityFormData = {
      id: crypto.randomUUID(),
      version: 0,
      published: false,
      label: "",
      fields: []
    }
  } else {
    //TODO: get fields and positions
    try {
      const [entity] = await db
        .select()
        .from(entities)
        .where(eq(entities.id, entityId))
      entityFormData = { ...entity, fields: [] }
    } catch (e) {
      console.log(e)
      return error(500, 'error')
    }
  }
  return await superValidate(entityFormData, valibot(entitySchema), { id: 'entity-form', errors: false })
}
