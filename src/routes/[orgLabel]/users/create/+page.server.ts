import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { usersSchema } from "../schema"
import { userCreate } from "./actions.server"
import type { Actions, PageServerLoad } from "./$types"

export const actions = {
  create: async (e) => {
    return await userCreate(e)
  }
} satisfies Actions

export const load: PageServerLoad = async ({ params: { orgLabel }, locals: { subject } }) => {
  const userOrgId = subject.properties.orgId
  return {
    orgLabel,
    userForm: await superValidate({
      id: crypto.randomUUID(),
      orgId: userOrgId
    }, valibot(usersSchema), { errors: false }),
    lookups: {
      org: [{
        id: userOrgId,
        label: orgLabel
      }]
    }
  }
}
