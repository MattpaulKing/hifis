import { superValidate } from "sveltekit-superforms";
import { ar } from "./actionResponse";
import { valibot } from "sveltekit-superforms/adapters";
import { and, SQL } from "drizzle-orm";
import type { ISchema } from "$src/lib/components/forms/initForm.svelte";
import type { PgTable, TableConfig } from "drizzle-orm/pg-core";
import type { FormValidated } from "$src/lib/interfaces";
import type { DB } from "../db/client";
import type { RequestEvent } from "@sveltejs/kit";

export default async function validateForm<T extends RequestEvent, P extends ISchema>({ requestEvent: { request, params }, schema }: { requestEvent: T, schema: P }) {
  const form = await superValidate(request, valibot(schema))
  if (typeof form.data === "object" && "id" in form.data && "action" in params && params.action === "create") {
    form.data.id = crypto.randomUUID()
  }
  return form
}

export async function insertFormData<T extends PgTable, P extends FormValidated<T["$inferInsert"]>>({
  db,
  table,
  form,
  opts = { returning: true }
}: { db: DB, table: T, form: P, opts?: { returning: boolean } }) {
  if (!form.valid) {
    return ar.invalid({ form })
  }
  let inserted: T["$inferSelect"]
  try {
    if (opts.returning) {
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
    return ar.dbError({ form })
  }
  return ar.success({ form })
}

export async function updateFormData<T extends PgTable<TableConfig & {}>, P extends FormValidated<T["$inferInsert"] & { id: string }>>({
  db,
  table,
  form,
  eqStmts,
  opts = { returning: true }
}: { db: DB, table: T, form: P, eqStmts: SQL[], opts?: { returning?: boolean } }) {
  let inserted: T["$inferSelect"]
  try {
    if ("returning" in opts) {
      [inserted] = await db
        .update(table)
        .set(form.data)
        .where(and(...eqStmts))
        .returning()
      if (typeof form.data === "object" && "id" in form.data) {
        form.data.id = inserted.id
      }
    } else {
      await db
        .update(table)
        .set(form.data)
        .where(and(...eqStmts))
    }
  } catch (e) {
    console.log(e)
    return ar.dbError({ form })
  }
  return ar.success({ form })
}
