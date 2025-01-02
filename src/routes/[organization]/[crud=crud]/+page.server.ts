import { organizationInsertSchema } from "../schema";
import { superValidate } from 'sveltekit-superforms';
import { valibot } from "sveltekit-superforms/adapters"
import { error } from "@sveltejs/kit";
import { formSuccess } from "$lib/components/forms/formResponses.server";
import type { Actions, PageServerLoad } from "./$types";
import type { CRUD } from "../../../params/crud";

export const actions = {
  default: async (e) => {
    const action = e.params.crud as CRUD
    switch (action) {
      case "create":
      case "update":
        console.log('hit')
        const form = await superValidate(e.request, valibot(organizationInsertSchema))
        console.log(form)
        return formSuccess(form)
      case "delete":
      default:
        error(404, "Unknown action")
    }
  }
} satisfies Actions

export const load: PageServerLoad = async ({ locals: { db } }) => {
  // const org = db.select().from(organizations).where()
  return {
    orgForm: await superValidate(valibot(organizationInsertSchema))
  }
}
