import { getRequestEvent, query } from "$app/server"
import type { FormData } from "$src/lib/interfaces/forms"
import { entityFieldLayouts, entityFields, entityFieldsSchema } from "$src/schemas"
import { eq } from "drizzle-orm"

export const entityFieldDelete = query(entityFieldsSchema.entries.id, async (id: FormData<typeof entityFieldsSchema>['id']) => {
  let { locals: { db } } = getRequestEvent()
  await db
    .delete(entityFieldLayouts)
    .where(eq(entityFieldLayouts.fieldId, id))
  await db
    .delete(entityFields)
    .where(eq(entityFields.id, id))
})


