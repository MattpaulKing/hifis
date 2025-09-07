import { getRequestEvent, query } from "$app/server"
import { entityFieldLayouts, entityFields, entitySchema } from "$src/schemas"
import { eq } from "drizzle-orm"
import { tryQuery } from "$src/lib/server/db"
import type { FormData } from "$src/lib/interfaces/forms"

export const entityFieldUpsert = query(entitySchema.entries.fields.item, async (field: FormData<typeof entitySchema>['fields'][0]) => {
  let { locals: { db } } = getRequestEvent()
  let fieldProps: Omit<typeof field, "layouts">
  let [fieldId] = await db
    .select({ id: entityFields.id })
    .from(entityFields)
    .where(eq(entityFields.id, field.id))
    .limit(1)
  if (!fieldId) {
    [fieldProps] = await tryQuery({
      fn: db
        .insert(entityFields)
        .values(field)
        .returning(),
      errorMsg: "Error inserting fields"
    })
    await tryQuery({
      fn: db
        .insert(entityFieldLayouts)
        .values(Object.values(field.layouts)),
      errorMsg: "Error inserting field layouts."
    })
    console.log(field.layouts)
  } else {
    [fieldProps] = await tryQuery({
      fn: db
        .update(entityFields)
        .set(field)
        .where(eq(entityFields.id, field.id))
        .returning(),
      errorMsg: "Error updating fields"
    })
  }
  return {
    ...fieldProps,
    layouts: field.layouts
  }
})


