import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { ar } from "$lib/server/forms"
import { clientContactFormSchema, clients } from "../schema";
import type { RequestEvent } from "../create/$types";

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await superValidate(request, valibot(clientContactFormSchema))
  if (!form.valid) return ar.invalid({ form })
  try {
    const [insertedClient] = await db
      .insert(clients)
      .values(form.data)
      .returning()
    form.data.id = insertedClient.id
  } catch (e) {
    console.log(e)
    return ar.dbError({ form })
  }
  return ar.success({ form })
}
