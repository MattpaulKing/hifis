import { users, usersFormSchema } from "../../schema"
import { insertFormData, validateForm } from "$lib/server/forms"
import type { RequestEvent } from "../$types"

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: usersFormSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    form,
    table: users
  })
}
