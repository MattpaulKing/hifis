import { updateFormData, validateForm } from "$src/lib/server/forms";
import { serviceEvents, serviceEventsFormSchema } from "../../schema";
import { eq } from "drizzle-orm";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: serviceEventsFormSchema })
  return await updateFormData({
    db: requestEvent.locals.db,
    form,
    table: serviceEvents,
    eqStmts: [eq(serviceEvents.id, form.data.id)]
  })
}
