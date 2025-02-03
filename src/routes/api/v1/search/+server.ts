import { json, type RequestHandler } from "@sveltejs/kit";
import { clients } from "$routes/[orgLabel]/clients/schema";
import { sql } from "drizzle-orm";

type SearchParams = {
  value?: string
}
export type SearchData = {
  id: string;
  label: string;
  description: string;
}
export type ResponseJSON = {
  type: "error";
  error: string;
} | {
  type: "success";
  data: SearchData[]
}

export const GET: RequestHandler = async ({ url: { searchParams }, locals: { db } }) => {
  const { value }: SearchParams = Object.fromEntries(searchParams)
  if (!value) return json({ type: "error", error: "No search value" })
  //@ts-ignore HACK: type is wrong from db.execute
  let { rows: data } = await db.execute(sql`
    select
      ${clients.id},
      ${clients.firstName}||' '||${clients.lastName} as "label",
      ${clients.dob} as "description"
    from
      ${clients}
    where
      to_tsvector('english', ${clients.firstName} || ' ' || ${clients.lastName}) 
      @@ to_tsquery('english', ${value.trim().replaceAll(" ", " | ")})
  `) as { rows: SearchData[] }
  if (data.length <= 0) return json({ type: "success", data: [] })
  return json({
    type: 'success',
    data
  })
}
