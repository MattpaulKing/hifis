import { authorizer } from "@openauthjs/openauth"
import { MemoryStorage } from "@openauthjs/openauth/storage/memory"
import { PasswordAdapter } from "@openauthjs/openauth/adapter/password"
import { PasswordUI } from "@openauthjs/openauth/ui/password"
import { subjects } from "$lib/auth/subjects"

async function getUser(email: string) {
  // Get user from database
  // Return user ID
  return "123"
}

export default authorizer({
  subjects,
  storage: MemoryStorage({
    persist: "./persist.json",
  }),
  providers: {
    password: PasswordAdapter(
      PasswordUI({
        sendCode: async (email, code) => {
          console.log(email, code)
        },
      }),
    ),
  },
  success: async (ctx, value, req) => {
    if (value.provider === "password") {
      return ctx.subject("user", {
        email: value.email,
        orgId: await getUser(value.email),
      })
    }
    throw new Error("Invalid provider")
  },
})
