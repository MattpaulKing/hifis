import { createClient } from "@openauthjs/openauth/client"
import type { RequestEvent } from "@sveltejs/kit"

export const client = createClient({
  clientID: "sveltekit",
  issuer: "http://localhost:3000", // TODO: configure domain
})

export function setTokens(event: RequestEvent, access: string, refresh: string) {
  event.cookies.set("refresh_token", refresh, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  })
  event.cookies.set("access_token", access, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  })
}
