import { updateFormData, validateForm } from "$lib/server/forms"
import { eq } from "drizzle-orm";
import { clientContactFormSchema, clients } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: clientContactFormSchema })
  return await updateFormData({
    db: requestEvent.locals.db,
    table: clients,
    form,
    eqStmts: [eq(clients.id, form.data.id)]
  })
}
