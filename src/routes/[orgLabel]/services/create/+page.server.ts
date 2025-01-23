import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { servicesFormSchema } from "../schema";
import { servicesCreate } from "../actions.server";
import type { Actions, PageServerLoad } from "./$types";

export const actions = {
  create: async (e) => await servicesCreate(e)
} satisfies Actions

export const load: PageServerLoad = async ({ params: { orgLabel }, locals: { subject, db } }) => {
  return {
    orgLabel,
    serviceForm: await superValidate({
      id: crypto.randomUUID(),
      orgId: subject.properties.orgId,
    }, valibot(servicesFormSchema), { errors: false })
  }
}
