import { insertFormData, validateForm } from "$lib/server/forms"
import { clientsServices } from "$src/schemas";
import { clientServiceFormSchema } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: clientServiceFormSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    table: clientsServices,
    form
  })
}
