import { ar, validateForm } from "$lib/server/forms"
import { clientContactFormSchema, clients } from "../schema";
import type { RequestEvent } from "../[clientId=uuid]/$types";

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await validateForm({ request, schema: clientContactFormSchema })
  if (!form.valid) return ar.invalid({ form })
  try {
    const [updatedClient] = await db
      .update(clients)
      .set(form.data)
      .returning()
  } catch (e) {
    console.log(e)
    return ar.dbError({ form })
  }
  return ar.success({ form })
}
