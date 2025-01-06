import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { users, usersInsertSchema } from "../schema"
import { formResponse } from "$lib/server/forms"
import type { Actions, PageServerLoad } from "./$types"
import type { CRUD } from "../../../../params/crud"

export const actions = {
  invite: async (e) => {
    const { request, locals: { db } } = e
    const form = await superValidate(request, valibot(usersInsertSchema))
    if (!form.valid) return formResponse.invalid({ form })
    try {
      const [insertedUser] = await db
        .insert(users)
        .values(form.data)
        .returning()
    } catch (e) {
      console.log(e)
      return formResponse.dbError({ form })
    }
    return formResponse.success({ form })
  }
} satisfies Actions

export const load: PageServerLoad = async ({ params: { crud, organization: orgLabel }, locals: { subject } }) => {
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
