import { ar, updateFormData, validateForm } from "$lib/server/forms"
import { clientsServices } from "$src/schemas";
import { clientServiceFormSchema } from "../../schema";
import { eq } from "drizzle-orm";
import type { RequestEvent } from "../$types";

export default async function({ params, request, locals: { db } }: RequestEvent) {
  const form = await validateForm({ request, schema: clientServiceFormSchema })
  if (params.action !== "update") return ar.invalid({ form })
  return await updateFormData({
    db,
    table: clientsServices,
    form,
    eqStmts: [
      eq(clientsServices.clientId, form.data.clientId),
      eq(clientsServices.serviceId, form.data.serviceId)
    ]
  })
}
