import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { servicesFormSchema } from "../schema";
import { serviceCreate } from "../actions.server";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { subject, db } }) => {
  return {
    serviceForm: await superValidate({
      id: crypto.randomUUID(),
      orgId: subject.properties.orgId,
    }, valibot(servicesFormSchema), { errors: false })
  }
}

export const actions = {
  create: async (e) => await serviceCreate(e)
} satisfies Actions
