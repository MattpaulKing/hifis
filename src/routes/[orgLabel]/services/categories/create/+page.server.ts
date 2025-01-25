import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { serviceCategories, serviceCategoriesFormSchema } from "../schema";
import { ar } from "$lib/server/forms";
import type { Actions, PageServerLoad } from "../../categories/create/$types";

export const load: PageServerLoad = async ({ locals: { db } }) => {
  return {
    serviceCategoryForm: await superValidate({
      id: crypto.randomUUID(),
    }, valibot(serviceCategoriesFormSchema), { errors: false })
  }
}

export const actions = {
  create: async ({ request, locals: { db, subject } }) => {
    const form = await superValidate(request, valibot(serviceCategoriesFormSchema))
    if (!form.valid) return ar.invalid({ form })
    try {
      const [serviceCategoryInserted] = await db
        .insert(serviceCategories)
        .values(form.data)
        .returning()
    } catch (e) {
      console.log(e)
      return ar.dbError({ form })
    }
    return ar.success({ form })
  }
} satisfies Actions
