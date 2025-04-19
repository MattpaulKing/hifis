import { ar } from "$src/lib/server/forms";
import { entityFields, entityFieldsSchema } from "$src/schemas";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { tryQuery } from "$src/lib/server/db";
import { eq } from "drizzle-orm";
import type { Actions } from "./$types";

export const actions = {
  default: async (e) => {
    let { locals: { db } } = e
    const form = await superValidate(e.request, valibot(entityFieldsSchema))
    if (!form.data.id) return ar.invalid({ form, msg: "ID not found" })
    let [entityField] = await tryQuery({
      fn: db.select({ id: entityFields.id }).from(entityFields).where(eq(entityFields.id, form.data.id)),
      errorMsg: "Unable to find entity layout"
    })
    if (entityField) {
      await tryQuery({
        fn: db.update(entityFields).set(form.data).where(eq(entityFields.id, form.data.id)),
        errorMsg: "Something went wrong"
      })
    } else {
      await tryQuery({
        fn: db.insert(entityFields).values(form.data),
        errorMsg: "Something went wrong"
      })
    }
    return ar.success({ form })
  },
} satisfies Actions
