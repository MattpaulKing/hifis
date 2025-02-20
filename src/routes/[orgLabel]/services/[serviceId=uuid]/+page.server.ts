import { superValidate } from "sveltekit-superforms"
import type { PageServerLoad, Actions } from "./$types"
import { valibot } from "sveltekit-superforms/adapters"
import { servicesFormSchema } from "../schema"

export const load: PageServerLoad = async ({ locals: { db } }) => {
  return {
    serviceForm: await superValidate({
      id: crypto.randomUUID()
    }, valibot(servicesFormSchema), { errors: false })
  }
}

export const actions = {

} satisfies Actions
