import { insertFormData, validateForm } from "$lib/server/forms"
import { clientServiceEvents, clientServiceEventSchema} from "$routes/[orgLabel]/clients/[clientId=uuid]/services/events/schema"
import type { RequestEvent } from "../$types"

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: clientServiceEventSchema})
  return await insertFormData({
    db: requestEvent.locals.db,
    table: clientServiceEvents,
    form,
  })
}
