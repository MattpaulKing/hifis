import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { clientCreate } from "../actions.server";
import { clientContactFormSchema } from "../schema";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ }) => {
  const today = new Date()
  return {
    clientContactForm: await superValidate({
      dob: new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()),
    }, valibot(clientContactFormSchema), { errors: false }),
  }
}

export const actions = {
  create: async (e) => {
    return await clientCreate(e)
  }
} satisfies Actions
