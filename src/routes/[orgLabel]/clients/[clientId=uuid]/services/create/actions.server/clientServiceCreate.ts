import { insertFormData, validateForm } from "$lib/server/forms"
import { clientsServices } from "$src/schemas";
import { clientServiceFormSchema } from "../../schema";
import type { RequestEvent } from "../$types";

export default async function({ request, locals: { db } }: RequestEvent) {
  const form = await validateForm({ request, schema: clientServiceFormSchema })
  return await insertFormData({
    db,
    table: clientsServices,
    form
  })
}
