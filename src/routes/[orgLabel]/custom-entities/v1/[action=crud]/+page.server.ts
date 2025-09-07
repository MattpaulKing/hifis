import { superValidate } from "sveltekit-superforms"
import { entities, entityBlocksSchema, entityFields, entityFieldsSchema, entitySchema } from "$src/schemas"
import { valibot } from "sveltekit-superforms/adapters"
import { tryQuery } from "$src/lib/server/db"
import { route } from "$src/lib/ROUTES"
import { error, redirect } from "@sveltejs/kit"
import { ar } from "$src/lib/server/forms"
import { eq } from "drizzle-orm"
import { entityAndElementsQueryById, entityBlockLayoutMetaDataQuery, entityDbToClient, entityFieldLayoutMetaDataQuery } from "../../lib"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ url, params: { action }, locals: { db, subject } }) => {
  if (action === "create") {
    let id = crypto.randomUUID()
    await tryQuery({
      fn: db.insert(entities).values([{
        id,
        label: "Example Entity",
        version: 1,
      }]),
      errorMsg: "Oops"
    })
    redirect(302, `${route("/[orgLabel]/custom-entities/v1/[action=crud]", { orgLabel: subject.properties.orgLabel, action: "update" })}?id=${id}`)
  }
  let id = url.searchParams.get("id") ?? error(404, "No id found")
  return {
    entityId: id,
    entityForm: await entityAndElementsQueryById(id)
      .then(entityDbToClient)
      .then(async entity => await superValidate(entity, valibot(entitySchema), { id: 'entity-form', errors: true })),
    entityFieldForm: await superValidate(valibot(entityFieldsSchema)),
    entityBlockForm: await superValidate(valibot(entityBlocksSchema)),
    entityFieldLayoutMetaData: await entityFieldLayoutMetaDataQuery(),
    entityBlockLayoutMetaData: await entityBlockLayoutMetaDataQuery(),

  }
}

export const actions = {
  updateEntity: async (e) => {
    return e
  },
  updateEntityField: async (e) => {
    let form = await superValidate(e.request, valibot(entityFieldsSchema))
    if (!form.valid) return ar.invalid({ form, msg: "Please check fields for errors." })
    let [field] = await e.locals.db.update(entityFields)
      .set(form.data)
      .where(eq(entityFields.id, form.data.id))
      .returning()
    if (!field) return ar.dbError({ form, msg: "Something went wrong, please try again." })
    return ar.success({ form, msg: "Success" })
  }
} satisfies Actions
