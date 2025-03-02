import { insertFormData, validateForm } from "$lib/server/forms"
import { clientServiceEvents, clientServiceEventsFormSchema } from "$routes/[orgLabel]/clients/[clientId=uuid]/services/events/schema"
import type { RequestEvent } from "../$types"

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: clientServiceEventsFormSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    table: clientServiceEvents,
    form,
  })
}
