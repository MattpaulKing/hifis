import { insertFormData, validateForm } from "$src/lib/server/forms";
import { serviceEvents, serviceEventsFormSchema } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: serviceEventsFormSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    form,
    table: serviceEvents
  })
}
