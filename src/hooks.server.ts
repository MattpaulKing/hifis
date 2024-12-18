import { client, setTokens } from "$lib/auth/auth.client"
import { subjects } from "$lib/auth/subjects"
import { db } from "$lib/server/db"
import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit"

async function verifyAndSetTokens(event: RequestEvent) {
  const accessToken = event.cookies.get("access_token")
  if (accessToken) {
    const refreshToken = event.cookies.get("refresh_token")
    const verified = await client.verify(subjects, accessToken, {
      refresh: refreshToken,
    })
    if (!verified.err) {
      if (verified.tokens)
        setTokens(event, verified.tokens.access, verified.tokens.refresh)
      event.locals.subject = verified.subject
      return { error: null }
    }
    return { error: verified.err }
  }
  return { error: "Invalid access" }
}

export const handle: Handle = async ({ event, resolve }) => {
  const { error: err } = await verifyAndSetTokens(event)
  const { url } = await client.authorize(new URL(event.request.url).origin + "/auth/callback", "code")
  if (err && !event.url.pathname.startsWith("/auth/callback")) {
    redirect(302, url)
  }
  console.dir(event, { depth: null })
  event.locals.db = db
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    },
  })
}
