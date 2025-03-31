import { updateFormData, validateForm } from "$lib/server/forms"
import { clientsServices } from "$src/schemas";
import { clientServiceSchema } from "../../schema";
import { eq } from "drizzle-orm";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: clientServiceSchema })
  return await updateFormData({
    db: requestEvent.locals.db,
    table: clientsServices,
    form,
    eqStmts: [
      eq(clientsServices.clientId, form.data.clientId),
      eq(clientsServices.serviceId, form.data.serviceId)
    ]
  })
}
