import { and, sql, type SQL } from "drizzle-orm";
import { logCategories } from "$src/schemas";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

type SearchParams = Partial<{
  search: string;
  lookups: string;
}>

export const GET: RequestHandler = async ({ url, locals: { db } }) => {
  let searchParams = Object.fromEntries(url.searchParams) as SearchParams
  let filters: SQL[] = []
  if (searchParams.search) {
    filters.push(
      sql`
        to_tsvector('english', ${logCategories.label}) 
        @@ to_tsquery('english', ${searchParams.search.trim().replaceAll(" ", " | ")})
      `
    )
  }
  return json(
    await db
      .select()
      .from(logCategories)
      .where(and(...filters))
  )
}
