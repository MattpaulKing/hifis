import { eq } from "drizzle-orm"
import { superValidate } from "sveltekit-superforms"
import { entities, entityFieldLayoutSchema, entityFieldsSchema, entitySchema, users } from "$src/schemas"
import { valibot } from "sveltekit-superforms/adapters"
import { ar, validateForm } from "$src/lib/server/forms"
import { error, redirect } from "@sveltejs/kit"
import { insertAndReturn, tryQuery } from "$src/lib/server/db"
import { entityCreate } from "../lib"
import { route } from "$src/lib/ROUTES"
import type { DB } from "$src/lib/server/db/client"
import type { Actions, PageServerLoad } from "./$types"
import type { FormValidated } from "$src/lib/interfaces"

type SearchParams = {
  entityId?: string
}

export const load: PageServerLoad = async ({ url, params: { orgLabel, action }, locals: { db, subject } }) => {
  let searchParams: SearchParams = Object.fromEntries(url.searchParams)

  if (action === 'create') {
    let [entity] = await insertAndReturn({ db, table: entities, rows: [{ label: "Form Title", version: 0 }] })
    redirect(302, `${route("/[orgLabel]/custom-entities/[action=crud]", {
      orgLabel,
      action: "update"
    })}?entityId=${entity.id}`)
  } else if (!searchParams.entityId) {
    return error(404, "Entity not found")
  }

  let entityForm = await getEntityFormValidated({ entityId: searchParams.entityId, db })
  if (!entityForm.data.id) return error(500, "Something went wrong")

  return {
    action,
    entityId: entityForm.data.id,
    entityForm,
    entityFieldsForm: await superValidate({
      entityId: entityForm.data.id,
    }, valibot(entityFieldsSchema), { errors: false }),
    entityFieldLayoutForm: await superValidate({
    }, valibot(entityFieldLayoutSchema), { errors: false }),
    orgsUsers: await db
      .select()
      .from(users)
      .where(eq(users.orgId, subject.properties.orgId))
  }
}

export const actions = {
  default: async (e) => {
    const form = await validateForm({ requestEvent: e, schema: entitySchema })
    if (!form.valid) return ar.invalid({ form })
    if (e.params.action === 'create') {
      return await entityCreate({ e, entity: form.data })
    } else if (e.params.action === 'update') {

    }
    return ar.success({ form })
  }
} satisfies Actions

async function getEntityFormValidated({ entityId, db }: { entityId: string, db: DB }): Promise<FormValidated<typeof entitySchema>> {
  let entityFormData: FormValidated<typeof entitySchema>['data']
  let [entity] = await tryQuery({
    fn: db
      .query.entities.findMany({
        with: {
          fields: {
            with: {
              layouts: {},
            },
          }
        },
        where: eq(entities.id, entityId)
      }),
    errorMsg: "Entity not found"
  })
  console.dir(entity, { depth: null })
  let fields = entity?.fields.map(({ layouts, ...field }) => ({
    properties: field,
    layout: layouts[0]
  })) ?? []
  entityFormData = {
    ...entity,
    fields
  }
  return await superValidate(entityFormData, valibot(entitySchema), { id: 'entity-form', errors: false })
}
