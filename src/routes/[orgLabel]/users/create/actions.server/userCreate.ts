import { users, usersSchema } from "../../schema"
import { insertFormData, validateForm } from "$lib/server/forms"
import type { RequestEvent } from "../$types"

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: usersSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    form,
    table: users
  })
}
