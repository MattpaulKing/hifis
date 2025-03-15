import { updateFormData, validateForm } from "$lib/server/forms"
import { eq } from "drizzle-orm";
import { servicesReferrals, servicesReferralsFormSchema } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: servicesReferralsFormSchema })
  return await updateFormData({
    db: requestEvent.locals.db,
    table: servicesReferrals,
    form,
    eqStmts: [
      eq(servicesReferrals.clientId, form.data.clientId),
      eq(servicesReferrals.serviceId, form.data.serviceId)
    ]
  })
}
