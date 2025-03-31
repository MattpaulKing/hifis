import { insertFormData, validateForm } from "$lib/server/forms"
import { services, servicesSchema} from "../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: servicesSchema})
  return await insertFormData({
    db: requestEvent.locals.db,
    form,
    table: services
  })
}
