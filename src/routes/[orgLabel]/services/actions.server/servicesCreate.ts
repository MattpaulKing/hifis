import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { ar } from "$lib/server/forms"
import { services, servicesFormSchema } from "../schema";
import type { RequestEvent } from "../create/$types";

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await superValidate(request, valibot(servicesFormSchema))
  if (!form.valid) return ar.invalid({ form })
  try {
    const [insertedService] = await db
      .insert(services)
      .values(form.data)
      .returning()
  } catch (e) {
    console.log(e)
    return ar.dbError({ form })
  }
  return ar.success({ form })
}
