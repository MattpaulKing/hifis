import { insertFormData, validateForm } from "$lib/server/forms"
import { logCategories, logCategoriesFormSchema } from "$routes/[orgLabel]/logs/schema"
import type { RequestEvent } from "../$types"

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await validateForm({ request, schema: logCategoriesFormSchema })
  return await insertFormData({
    db,
    form,
    table: logCategories
  })
}
