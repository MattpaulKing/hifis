import { ar } from "$src/lib/server/forms";
import { entityFieldLayouts, entityFieldLayoutSchema } from "$src/schemas";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { tryQuery } from "$src/lib/server/db";
import { eq } from "drizzle-orm";
import type { Actions } from "./$types";

export const actions = {
  default: async (e) => {
    let { locals: { db } } = e
    const form = await superValidate(e.request, valibot(entityFieldLayoutSchema))
    if (!form.data.id) return ar.invalid({ form, msg: "ID not found" })
    let [entityLayout] = await tryQuery({
      fn: db.select({ id: entityFieldLayouts.id }).from(entityFieldLayouts).where(eq(entityFieldLayouts.id, form.data.id)),
      errorMsg: "Unable to find entity layout"
    })
    if (entityLayout) {
      await tryQuery({
        fn: db.update(entityFieldLayouts).set(form.data).where(eq(entityFieldLayouts.id, form.data.id)),
        errorMsg: "Something went wrong"
      })
    } else {
      await tryQuery({
        fn: db.insert(entityFieldLayouts).values(form.data),
        errorMsg: "Something went wrong"
      })
    }
    return ar.success({ form })
  },
} satisfies Actions
