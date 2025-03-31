import { insertFormData, validateForm } from "$lib/server/forms"
import { clientContactSchema, clients } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: clientContactSchema})
  return await insertFormData({
    db: requestEvent.locals.db,
    table: clients,
    form,
  })
}
