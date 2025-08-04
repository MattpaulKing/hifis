import { superValidate } from "sveltekit-superforms"
import { entities, entitySchema } from "$src/schemas"
import { valibot } from "sveltekit-superforms/adapters"
import { tryQuery } from "$src/lib/server/db"
import { route } from "$src/lib/ROUTES"
import { error, redirect } from "@sveltejs/kit"
import { getEntity } from "../../schema/data.remote"
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
  let entityForm = await superValidate(await getEntity(id), valibot(entitySchema), { id: 'entity-form', errors: false })
  return {
    entityId: id,
    entityForm
  }
}

export const actions = {
  updateEntity: async (e) => {
    return e
  }
} satisfies Actions
