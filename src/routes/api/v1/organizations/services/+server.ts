import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

//TODO: Finish Services API
export const GET: RequestHandler = async ({ url: { searchParams }, locals: { db, subject } }) => {

  return json({})
}
