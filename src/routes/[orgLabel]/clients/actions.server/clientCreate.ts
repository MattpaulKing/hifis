import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { ar } from "$lib/server/forms"
import { clients, clientsFormSchema } from "../schema";
import type { RequestEvent } from "../create/$types";

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await superValidate(request, valibot(clientsFormSchema))
  if (!form.valid) return ar.invalid({ form })
  const { id, ...clientData } = form.data
  try {
    const [insertedClient] = await db
      .insert(clients)
      .values(clientData)
      .returning()
    form.data = insertedClient
  } catch (e) {
    console.log(e)
    return ar.dbError({ form })
  }
  return ar.success({ form })
}
