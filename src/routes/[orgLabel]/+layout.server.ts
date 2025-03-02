import { eq } from "drizzle-orm"
import { users } from "./users/schema"
import { organizations } from "./schema"
import { single } from "$lib/server/db"
import { clients, usersClients } from "$src/schemas"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals: { db, subject } }) => {
  return {
    org: await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, subject.properties.orgId))
      .then(single),
    user: await db
      .select()
      .from(users)
      .where(eq(users.id, subject.properties.id))
      .then(single),
    usersClients: await db
      .select({
        id: clients.id,
        label: clients.label
      })
      .from(usersClients)
      .where(eq(usersClients.userId, subject.properties.id))
      .leftJoin(clients, eq(clients.id, usersClients.userId))
  }
}
