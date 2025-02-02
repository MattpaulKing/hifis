import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { clientCreate } from "../actions.server";
import { clientContactFormSchema } from "../schema";
import type { Actions, PageServerLoad } from "./$types";

export const actions = {
  create: async (e) => {
    return await clientCreate(e)
  }
} satisfies Actions

export const load: PageServerLoad = async ({ }) => {
  const today = new Date()
  return {
    clientContactForm: await superValidate({
      id: crypto.randomUUID(),
      dob: new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()),
    }, valibot(clientContactFormSchema), { errors: false }),
  }
}
