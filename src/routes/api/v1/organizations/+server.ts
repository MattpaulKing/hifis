import { eq, sql } from "drizzle-orm";
import { json } from "@sveltejs/kit";
import { organizations } from "../../../[orgLabel]/schema";
import type { RequestHandler } from "./$types";
import type { Lookup } from "$lib/interfaces/Lookup";

type ApiParams = {
  id?: string;
  search?: string;
  lookups?: string;
}

export const GET: RequestHandler = async ({ locals: { db }, url: { searchParams } }) => {
  let params = Object.fromEntries(searchParams) as ApiParams
  let res: typeof organizations.$inferSelect | Lookup[] = []
  if (params.id) {
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, params.id))
      .limit(1)
    res = [org]
  }
  if (params.search) {
    const orgs = await db
      .select()
      .from(organizations)
      .where(sql`to_tsvector('english', ${organizations.label}) @@ to_tsquery('english', ${params.search})`)
    res = orgs
  }
  if (params.lookups) {
    res = res.map((org) => ({
      id: org.id,
      label: org.label
    }))
  }
  return json(res)
}
