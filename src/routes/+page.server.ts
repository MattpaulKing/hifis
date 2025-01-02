import { redirect } from "@sveltejs/kit";
import { organizations } from "../schemas";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { db, subject } }) => {
  if (subject) {
    const [org] = await db
      .select({ label: organizations.label })
      .from(organizations)
      .where(eq(organizations.id, subject.properties.orgId))
      .limit(1)

    redirect(302, `/${org.label}`)
  }
  return {

  }
}
