import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { usersInsertSchema } from "../schema"
import type { PageServerLoad } from "./$types"
import { organizations } from "../../schema"
import { eq } from "drizzle-orm"

export const load: PageServerLoad = async ({ locals: { db, subject } }) => {
  const userOrgId = subject.properties.orgId
  const [{ orgLabel }] = await db
    .select({ orgLabel: organizations.label })
    .from(organizations)
    .where(eq(organizations.id, userOrgId))
    .limit(1)
  return {
    userForm: await superValidate({
      id: crypto.randomUUID(),
      orgId: userOrgId
    }, valibot(usersInsertSchema), { errors: false }),
    lookups: {
      org: {
        id: userOrgId,
        label: orgLabel
      }
    }
  }
}
