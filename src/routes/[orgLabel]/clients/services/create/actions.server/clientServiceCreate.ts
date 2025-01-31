import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { ar } from "$lib/server/forms"
import { clientsServices, clientsServicesFormSchema } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function({ request, locals: { db } }: RequestEvent) {
  const form = await superValidate(request, valibot(clientsServicesFormSchema))
  if (!form.valid) return ar.invalid({ form })
  const { id, ...clientData } = form.data
  try {
    const [insertedClient] = await db
      .insert(clientsServices)
      .values(clientData)
      .returning()
    form.data = insertedClient
  } catch (e) {
    console.log(e)
    return ar.dbError({ form })
  }
  return ar.success({ form })
}
