import { insertFormData, validateForm } from "$lib/server/forms"
import { clientServiceEvents, clientServiceEventsFormSchema } from "../../schema"
import type { RequestEvent } from "../$types"

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await validateForm({ request, schema: clientServiceEventsFormSchema })
  return await insertFormData({
    db,
    table: clientServiceEvents,
    form,
  })
}
