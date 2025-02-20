import { updateFormData, validateForm } from "$lib/server/forms"
import { eq } from "drizzle-orm";
import { logCategories, logCategoriesFormSchema } from "$routes/[orgLabel]/logs/schema";
import type { RequestEvent } from "../$types";

export default async function(e: RequestEvent) {
  const { request, locals: { db } } = e
  const form = await validateForm({ request, schema: logCategoriesFormSchema })
  return await updateFormData({ db, table: logCategories, form, eqStmts: [eq(logCategories.id, form.data.id)] })
}
