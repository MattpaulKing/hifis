import { eq } from "drizzle-orm"
import { users } from "./users/schema"
import { superValidate } from "sveltekit-superforms"
import { entities, entityFieldLayouts, entityFields, entityFieldsSchema, entitySchema } from "$src/schemas"
import { valibot } from "sveltekit-superforms/adapters"
import type { Actions, PageServerLoad } from "./$types"
import type { TabEntity } from "$src/lib/components/user-grid"
import { ar, validateForm } from "$src/lib/server/forms"
import { error } from "@sveltejs/kit"
import type { DB } from "$src/lib/server/db/client"

export const load: PageServerLoad = async ({ locals: { db, subject } }) => {
  let id = crypto.randomUUID()
  return {
    entityFormId: id,
    entityForm: await superValidate({
      id,
      version: 0,
      published: false,
      label: "test"
    }, valibot(entitySchema), { errors: false }),
    entityFieldsForm: await superValidate({
      entityId: id,
    }, valibot(entityFieldsSchema), { errors: false }),
    usersComponents: [],
    entities: [
      { id: '1', label: 'something', active: false, tabType: "entity" },
      { id: '2', label: 'something else', active: true, tabType: "entity" },
      { id: '3', label: 'sth else', active: false, tabType: "entity" }
    ] as TabEntity[],
    orgsUsers: await db
      .select()
      .from(users)
      .where(eq(users.orgId, subject.properties.orgId))
  }
}

export const actions = {
  default: async (requestEvent) => {
    console.log('hit')
    let db = requestEvent.locals.db
    const form = await validateForm({ requestEvent, schema: entitySchema })
    console.log(form)
    if (!form.valid) return ar.invalid({ form })
    let { fields = [], ...entity } = form.data
    let insertedEntity = await insertEntity({ entity, db })
    try {
      const insertedEntityFields = await db
        .insert(entityFields)
        .values(fields.map(({ properties }) => properties))
        .returning()
    } catch (e) {
      console.log(e)
      return error(500, 'error')
    }
    try {
      const insertedEntityPositions = await db
        .insert(entityFieldLayouts)
        .values(fields.map(({ layout }) => layout))
        .returning()
    } catch (e) {
      console.log(e)
      return error(500, 'error')
    }
    return ar.success({ form })
  }
} satisfies Actions

async function insertEntity({ entity, db }: { entity: typeof entities.$inferInsert, db: DB }) {
  try {
    const [insertedEntity] = await db
      .insert(entities)
      .values(entity)
      .returning()
    return insertedEntity
  } catch (e) {
    console.log(e)
    return error(500, 'error')
  }
}
