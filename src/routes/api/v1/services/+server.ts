import { and, eq, getTableColumns, SQL, sql } from "drizzle-orm";
import { json } from "@sveltejs/kit";
import { services } from "$routes/[orgLabel]/services/schema";
import { serviceCategories } from "$src/schemas";
import { organizations } from "$routes/[orgLabel]/schema";
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
    filters.push(eq(services.id, params.id))
  }
  if (params.search) {
    filters.push(sql`
        to_tsvector('english', ${services.label}) 
        @@ to_tsquery('english', ${params.search.trim().replaceAll(" ", " | ")})
      `)
  }
  let servicesRows = await db
    .select(params.lookups
      ? { id: services.id, label: services.label }
      : {
        ...getTableColumns(services),
        categoryLabel: serviceCategories.label,
        orgLabel: organizations.label
      })
    .from(services)
    .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
    .leftJoin(organizations, eq(organizations.id, services.orgId))
    .where(and(...filters))

  return json(servicesRows)
}
