import { updateFormData, validateForm } from "$lib/server/forms"
import { eq } from "drizzle-orm";
import { clientContactFormSchema, clients } from "../schema";
import type { RequestEvent } from "../[action=crud]/$types";

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await validateForm({ request, schema: clientContactFormSchema })
  return await updateFormData({ db, table: clients, form, eqStmts: [eq(clients.id, form.data.id)] })
}
