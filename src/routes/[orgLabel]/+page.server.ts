import { eq } from "drizzle-orm"
import { users } from "./users/schema"
import { superValidate } from "sveltekit-superforms"
import { entityFieldSchema, entitySchema } from "$src/schemas"
import { valibot } from "sveltekit-superforms/adapters"
import type { PageServerLoad } from "./$types"
import type { TabEntity } from "$src/lib/components/user-grid"

export const load: PageServerLoad = async ({ locals: { db, subject } }) => {
  let id = crypto.randomUUID()
  return {
    entityForm: await superValidate({
      id,
      version: 0,
      published: false,
      label: "test"
    }, valibot(entitySchema), { errors: false }),
    entityFieldsForm: await superValidate({
      entityId: id,
    }, valibot(entityFieldSchema), { errors: false }),
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
