import { eq, sql } from "drizzle-orm";
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
  let res: typeof clients.$inferSelect[] = []
  if (params.id) {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, params.id))
      .limit(1)
    res = [client]
  }
  if (params.search) {
    res = await db
      .select()
      .from(clients)
      .where(sql`
        to_tsvector('english', ${clients.firstName} || ' ' || ${clients.lastName}) 
        @@ to_tsquery('english', ${params.search.trim().replaceAll(" ", " | ")})
      `)
  }
  if (params.lookups) {
    return json(res.map((client) => ({
      id: client.id,
      label: `${client.firstName} ${client.lastName}`
    })))
  } else {
    return json(res)
  }
}
