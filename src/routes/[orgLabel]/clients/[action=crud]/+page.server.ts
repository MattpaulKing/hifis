import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { clientCreate, clientUpdate } from "../actions.server";
import { clientContactFormSchema } from "../schema";
import type { Actions, PageServerLoad } from "./types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ }) => {
  const today = new Date()
  return {
    clientContactForm: await superValidate({
      dob: new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()),
    }, valibot(clientContactFormSchema), { errors: false }),
  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case "create":
        return await clientCreate(e)
      case "update":
        return await clientUpdate(e)
      default:
        error(404)


    }
  }
} satisfies Actions
