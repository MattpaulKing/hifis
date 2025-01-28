import { json } from "@sveltejs/kit";
import { serviceCategories } from "$routes/[orgLabel]/services/categories/schema";
import { and, eq, SQL, sql } from "drizzle-orm";
import type { RequestHandler } from "./$types";

type ApiParams = {
  id?: string,
  search?: string,
  lookups?: string,
}

export const GET: RequestHandler = async ({ url: { searchParams }, locals: { db } }) => {
  let params = Object.fromEntries(searchParams) as ApiParams
  let res: typeof serviceCategories.$inferSelect[] = []
  let filters: SQL[] = []
  if (params.id) {
    filters.push(eq(serviceCategories.id, params.id))
  }
  if (params.search) {
    filters.push(sql`
        to_tsvector('english', ${serviceCategories.label}) 
        @@ websearch_to_tsquery('simple', ${params.search.replaceAll(" ", " | ")})
      `)
  }
  res = await db
    .select()
    .from(serviceCategories)
    .where(and(...filters))
    .limit(params.lookups ? 5 : -1)

  return json(res)
}
