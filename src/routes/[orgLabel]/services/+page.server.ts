import { eq } from "drizzle-orm"
import { services } from "./schema"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { subject, db } }) => {
  return {
    services: await db
      .select()
      .from(services)
      .where(eq(services.orgId, subject.properties.orgId))
  }
}
