import { json } from "@sveltejs/kit";
import { entities } from "$src/schemas";
import { tryQuery } from "$src/lib/server/db";
import { getTableColumns } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url: { searchParams }, locals: { db } }) => {
  let params = {
    lookups: searchParams.has("lookups"),
    search: searchParams.get("search")
  }

  let res = await tryQuery({
    fn: db
      .select(params.lookups ? { id: entities.id, label: entities.label } : getTableColumns(entities))
      .from(entities),
    errorMsg: "Unable to find entities"
  })
  console.log(res)


  return json(res)
}
