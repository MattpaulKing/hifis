import { ar, insertFormData, validateForm } from "$lib/server/forms"
import { clientsServices } from "$src/schemas";
import { clientServiceFormSchema } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function({ params, request, locals: { db } }: RequestEvent) {
  const form = await validateForm({ request, schema: clientServiceFormSchema })
  if (params.action !== "create") return ar.invalid({ form })
  return await insertFormData({
    db,
    table: clientsServices,
    form
  })
}
