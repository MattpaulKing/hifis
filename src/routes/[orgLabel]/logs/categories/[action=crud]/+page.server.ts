import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { logCategoriesFormSchema } from "../../schema"
import { error } from "@sveltejs/kit"
import { logCategoryCreate, logCategoryUpdate } from "./actions.server"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ params: { action }, locals: { db } }) => {
  return {
    params: {
      action,
    },
    logCategoryForm: await superValidate({
      id: crypto.randomUUID(),
    }, valibot(logCategoriesFormSchema), { errors: false })
  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case 'create':
        return await logCategoryCreate(e)
      case 'update':
        return await logCategoryUpdate(e)
      case 'delete':
        return {}
      default:
        return error(404)
    }
  }
} satisfies Actions
