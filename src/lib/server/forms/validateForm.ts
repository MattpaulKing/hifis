import { superValidate } from "sveltekit-superforms";
import { ar } from "./actionResponse";
import { valibot } from "sveltekit-superforms/adapters";
import type { ISchema } from "$src/lib/components/forms/initForm.svelte";
import type { PgTable } from "drizzle-orm/pg-core";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { FormValidated } from "$src/lib/interfaces";

export default async function validateForm<T extends Request, P extends ISchema>({ request, schema }: { request: T, schema: P }) {
  const form = await superValidate(request, valibot(schema))
  if (typeof form.data === "object" && "id" in form.data) {
    form.data.id = crypto.randomUUID()
  }
  return form
}

export async function insertFormData<T extends PgTable, P extends FormValidated<T["$inferInsert"]>>({
  db,
  table,
  form,
  opts = { returning: true }
}: { db: PostgresJsDatabase, table: T, form: P, opts?: { returning?: boolean } }) {
  let inserted: T["$inferSelect"]
  try {
    if ("returning" in opts) {
      [inserted] = await db
        .insert(table)
        .values(form.data)
        .returning()
      if (typeof form.data === "object" && "id" in form.data) {
        form.data.id = inserted.id
      }
    } else {
      await db
        .insert(table)
        .values(form.data)
    }
  } catch (e) {
    console.log(e)
    return ar.dbError({ form })
  }
  return ar.success({ form })
}
