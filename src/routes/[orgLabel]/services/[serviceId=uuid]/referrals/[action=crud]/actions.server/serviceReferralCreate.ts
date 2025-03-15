import { insertFormData, validateForm } from "$lib/server/forms"
import { servicesReferrals, servicesReferralsFormSchema } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: servicesReferralsFormSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    table: servicesReferrals,
    form,
  })
}
