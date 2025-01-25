import { eq } from "drizzle-orm"
import { users } from "./users/schema"
import { organizations } from "./schema"
import { single } from "$lib/server/db"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals: { db, subject } }) => {
  return {
    org: await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, subject.properties.orgId))
      .then(single),
    user: await db
      .select()
      .from(users)
      .where(eq(users.id, subject.properties.id))
      .then(single)
  }
}
