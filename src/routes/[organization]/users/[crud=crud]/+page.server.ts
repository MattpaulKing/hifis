import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { usersInsertSchema } from "../schema"
import type { PageServerLoad } from "./$types"
import type { CRUD } from "../../../../params/crud"

export const load: PageServerLoad = async ({ params: { crud, organization: orgLabel }, locals: { db, subject } }) => {
  const userOrgId = subject.properties.orgId
  return {
    crud: crud as CRUD,
    userForm: await superValidate({
      id: crypto.randomUUID(),
      orgId: userOrgId
    }, valibot(usersInsertSchema), { errors: false }),
    lookups: {
      org: [{
        id: userOrgId,
        label: orgLabel
      }]
    }
  }
}
