import { client, setTokens } from "$lib/auth/auth.client";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
  const code = event.url.searchParams.get("code")
  if (!code) return error(403, "Invalid code")
  const tokens = await client.exchange(code!, event.url.origin + "/auth/callback")
  if (tokens.err) return error(403, tokens.err)
  setTokens(event, tokens.tokens.access, tokens.tokens.refresh)
  redirect(302, `/${event.locals.subject.properties.orgLabel}`)
}
