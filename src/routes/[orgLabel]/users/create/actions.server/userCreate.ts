import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { users, usersFormSchema } from "../../schema"
import { ar } from "$lib/server/forms"
import type { RequestEvent } from "../$types"

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await superValidate(request, valibot(usersFormSchema))
  if (!form.valid) return ar.invalid({ form })
  try {
    const { id, ...userFormData } = form.data
    const [insertedUser] = await db
      .insert(users)
      .values(userFormData)
      .returning()
    form.data.id = insertedUser.id
  } catch (e) {
    console.log(e)
    return ar.dbError({ form })
  }
  return ar.success({ form })
}
