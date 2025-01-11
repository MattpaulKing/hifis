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
  return {
    orgLabel,
    clientForm: await superValidate({
      id: crypto.randomUUID(),
      orgId: userOrgId
    }, valibot(clientsFormSchema), { errors: false }),
    lookups: {
      org: [{
        id: userOrgId,
        label: orgLabel
      }]
    }
  }
}
