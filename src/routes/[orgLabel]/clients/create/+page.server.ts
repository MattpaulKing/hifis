import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { clientsFormSchema } from "../schema";
import { clientCreate } from "../actions.server";
import type { Actions, PageServerLoad } from "./$types";

export const actions = {
  default: async (e) => {
    return await clientCreate(e)
  }
} satisfies Actions

export const load: PageServerLoad = async ({ params: { orgLabel }, locals: { subject } }) => {
  const userOrgId = subject.properties.orgId
  const today = new Date()
  return {
    orgLabel,
    clientForm: await superValidate({
      id: crypto.randomUUID(),
      orgId: userOrgId,
      dob: new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()),
    }, valibot(clientsFormSchema), { errors: false }),
    lookups: {
      org: [{
        id: userOrgId,
        label: orgLabel
      }]
    }
  }
}
