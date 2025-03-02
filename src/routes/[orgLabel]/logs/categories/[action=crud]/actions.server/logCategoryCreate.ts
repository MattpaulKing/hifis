import { insertFormData, validateForm } from "$lib/server/forms"
import { logCategories, logCategoriesFormSchema } from "$routes/[orgLabel]/logs/schema"
import type { RequestEvent } from "../$types"

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: logCategoriesFormSchema })
  return await insertFormData({
    db: requestEvent.locals.db,
    form,
    table: logCategories
  })
}
