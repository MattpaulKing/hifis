import { insertFormData, validateForm } from "$src/lib/server/forms";
import { serviceEvents, serviceEventsSchema } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: serviceEventsSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    form,
    table: serviceEvents
  })
}
