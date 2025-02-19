import { and, eq, getTableColumns, SQL, sql } from "drizzle-orm";
import { json } from "@sveltejs/kit";
import { clients } from "../../../../schemas";
import type { RequestHandler } from "./$types";

type ApiParams = {
  id?: string;
  search?: string;
  lookups?: string;
}

export const GET: RequestHandler = async ({ locals: { db }, url: { searchParams } }) => {
  let params = Object.fromEntries(searchParams) as ApiParams
  let filters: SQL[] = []
  if (params.id) {
    filters.push(eq(clients.id, params.id))
  }
  if (params.search) {
    filters.push(sql`
        to_tsvector('english', ${clients.firstName} || ' ' || ${clients.lastName}) 
        @@ to_tsquery('english', ${params.search.trim().replaceAll(" ", " | ")})
      `)
  }
  return json(
    await db
      .select(params.lookups ? {
        id: clients.id, label: sql<string>`${clients.firstName}||' '||${clients.lastName}`
      }
        : getTableColumns(clients)
      )
      .from(clients)
      .where(and(...filters))
  )
}
