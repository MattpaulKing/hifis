import { eq } from "drizzle-orm"
import { users } from "./users/schema"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals: { db, subject } }) => {
  return {
    user: await db
      .select()
      .from(users)
      .where(eq(users.id, subject.properties.id))
      .then(x => x[0])
  }
}
