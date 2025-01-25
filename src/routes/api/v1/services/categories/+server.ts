import { json } from "@sveltejs/kit";
import { serviceCategories } from "$routes/[orgLabel]/services/categories/schema";
import { eq, sql } from "drizzle-orm";
import type { RequestHandler } from "./$types";

type ApiParams = {
  id?: string,
  search?: string,
  lookups?: string,
}

export const GET: RequestHandler = async ({ url: { searchParams }, locals: { db } }) => {
  let params = Object.fromEntries(searchParams) as ApiParams
  let res: typeof serviceCategories.$inferSelect[] = []
  if (params.id) {
    const [serviceCategory] = await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.id, params.id))
      .limit(1)
    res = [serviceCategory]
  }
  if (params.search) {
    res = await db
      .select()
      .from(serviceCategories)
      .where(sql`
        to_tsvector('english', ${serviceCategories.label}) 
        @@ to_tsquery('english', ${params.search.replaceAll(" ", " | ")})
      `)
  }
  return json(res)
}
