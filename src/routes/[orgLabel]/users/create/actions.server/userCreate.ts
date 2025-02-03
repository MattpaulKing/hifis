import { users, usersFormSchema } from "../../schema"
import { insertFormData, validateForm } from "$lib/server/forms"
import type { RequestEvent } from "../$types"

export default async function({ request, locals: { db } }: RequestEvent) {
  const form = await validateForm({ request, schema: usersFormSchema })
  return await insertFormData({
    db,
    form,
    table: users
  })
}
