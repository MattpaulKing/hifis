import { client, setTokens } from "$lib/auth/auth.client";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
  const code = event.url.searchParams.get("code")
  const next = event.url.searchParams.get("next")
  let redirectURI = `${event.url.origin}/auth/callback?next=${next}`
  if (!code) return error(403, "Invalid code")
  const tokens = await client.exchange(code, redirectURI)
  if (tokens.err) {
    return error(403, tokens.err)
  }
  setTokens(event, tokens.tokens.access, tokens.tokens.refresh)
  redirect(302, next ?? "/")
}
