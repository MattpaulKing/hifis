import { superValidate } from "sveltekit-superforms"
import { entitySchema } from "$src/schemas"
import { valibot } from "sveltekit-superforms/adapters"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { db, subject } }) => {

  let id = crypto.randomUUID()
  let entityForm = await superValidate({ id }, valibot(entitySchema), { id: 'entity-form', errors: false })
  return {
    entityId: id,
    entityForm
  }
}

export const actions = {
}
