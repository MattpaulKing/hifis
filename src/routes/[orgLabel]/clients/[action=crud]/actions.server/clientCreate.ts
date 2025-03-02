import { insertFormData, validateForm } from "$lib/server/forms"
import { clientContactFormSchema, clients } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: clientContactFormSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    table: clients,
    form,
  })
}
