import { insertFormData, validateForm } from "$lib/server/forms"
import { clientContactFormSchema, clients } from "../schema";
import type { RequestEvent } from "../create/$types";

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await validateForm({ request, schema: clientContactFormSchema })
  return await insertFormData({
    db,
    table: clients,
    form,
  })
}
