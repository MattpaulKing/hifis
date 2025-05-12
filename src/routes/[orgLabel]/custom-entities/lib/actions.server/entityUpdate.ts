import { tryQuery } from "$src/lib/server/db"
import { entities, entityFieldLayouts, entityFields, type entitySchema } from "$src/schemas"
import { eq } from "drizzle-orm"
import { ar } from "$src/lib/server/forms"
import type { FormValidated } from "$src/lib/interfaces"
import type { RequestEvent } from "../../[action=crud]/$types"

export default async function({ e, form }: { e: RequestEvent, form: FormValidated<typeof entitySchema> }) {
  if (!form.data.id) return ar.invalid({ form, msg: "No ID found." })
  let { fields, ...entityData } = form.data
  console.log('update')
  console.dir(fields, { depth: null })
  await tryQuery({
    fn: e.locals.db.update(entities).set(entityData).where(eq(entities.id, form.data.id)),
    errorMsg: "Something went wrong."
  })
  fields.forEach(async ({ properties, layout }) => {
    if (!properties.id || !layout.id) return ar.dbError({ form, msg: "No ID found." })
    await tryQuery({
      fn: e.locals.db.update(entityFields).set(properties).where(eq(entityFields.id, properties.id)),
      errorMsg: "Something went wrong."
    })
    await tryQuery({
      fn: e.locals.db.update(entityFieldLayouts).set(layout).where(eq(entityFieldLayouts.id, layout.id)),
      errorMsg: "Something went wrong."
    })
  })
  return ar.success({ form })
}
