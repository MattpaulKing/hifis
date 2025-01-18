import { json } from "@sveltejs/kit";
import type { GridItemState } from "$lib/interfaces/Grid";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals: { db, subject } }) => {
  const grid = await request.json() as GridItemState[]
  console.log(grid)
  // await db
  //   .update()
  return json({ message: "success" })
}
