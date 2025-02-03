import { insertFormData, validateForm } from "$lib/server/forms"
import { services, servicesFormSchema } from "../schema";
import type { RequestEvent } from "../create/$types";

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await validateForm({ request, schema: servicesFormSchema })
  return await insertFormData({
    db,
    form,
    table: services
  })
}
