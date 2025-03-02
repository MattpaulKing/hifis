import { error } from "@sveltejs/kit"
import { and, eq } from "drizzle-orm"
import { clientServiceEvents } from "$src/schemas"
import type { RequestEvent } from "../$types"

export default async function(requestEvent: RequestEvent) {
  const form = Object.fromEntries(await requestEvent.request.formData()) as { serviceEventId?: string, clientId?: string }
  if (!form.serviceEventId || !form.clientId) {
    console.log(form)
    return error(404)
  }
  try {
    await requestEvent.locals.db
      .delete(clientServiceEvents)
      .where(and(
        eq(clientServiceEvents.serviceEventId, form.serviceEventId),
        eq(clientServiceEvents.clientId, form.clientId)
      ))
  } catch (e) {
    console.log(e)
    return error(500)
  }
  return {}
}
