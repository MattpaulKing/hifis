import { insertFormData, validateForm } from "$lib/server/forms"
import { services, servicesFormSchema } from "../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: servicesFormSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    form,
    table: services
  })
}
