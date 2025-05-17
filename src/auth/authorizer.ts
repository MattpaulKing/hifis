import { authorizer } from "@openauthjs/openauth"
import { MemoryStorage } from "@openauthjs/openauth/storage/memory"
import { PasswordAdapter } from "@openauthjs/openauth/adapter/password"
import { PasswordUI } from "@openauthjs/openauth/ui/password"
import { subjects } from "$lib/auth/subjects"
import { drizzle } from "drizzle-orm/node-postgres";
import { Resource } from "sst";
import { organizations, users } from "../schemas"
import { eq } from "drizzle-orm"

async function getUser(email: string) {
  // Get user from database
  // Return org ID
  const db = drizzle(`postgres://${Resource.db.username}:${Resource.db.password}@${Resource.db.host}:${Resource.db.port}/${Resource.db.database}`)
  const [user] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      email: users.email,
      orgId: users.orgId,
      orgLabel: organizations.label
    })
    .from(users)
    .leftJoin(organizations, eq(organizations.id, users.orgId))
    .where(eq(users.email, email))
    .limit(1)
  if (!user) {
    throw Error("Invalid user")
  }
  return user
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
          //TODO: Send code & Make a record in public.users
        },
      }),
    ),
  },
  success: async (ctx, value, req) => {
    if (value.provider === "password") {
      const user = await getUser(value.email)
      console.log(req.url)
      return ctx.subject("user", {
        ...user
      })
    }
    throw new Error("Invalid provider")
  },
})
