import { updateFormData, validateForm } from "$lib/server/forms"
import { eq } from "drizzle-orm";
import { logCategories, logCategoriesFormSchema } from "$routes/[orgLabel]/logs/schema";
import type { RequestEvent } from "../$types";

export default async function(requestEvent: RequestEvent) {
  const form = await validateForm({ requestEvent, schema: logCategoriesFormSchema })
  return await updateFormData({
    db: requestEvent.locals.db,
    table: logCategories,
    form,
    eqStmts: [eq(logCategories.id, form.data.id)]
  })
}
