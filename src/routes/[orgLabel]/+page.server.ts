import { eq } from "drizzle-orm"
import { users } from "./users/schema"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { db, subject } }) => {
  return {
    orgsUsers: await db
      .select()
      .from(users)
      .where(eq(users.orgId, subject.properties.orgId))
  }
}
