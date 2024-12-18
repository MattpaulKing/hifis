import { users } from "$lib/server/db/schema/users"

export const load = async ({ locals: { db } }) => {
  return {
    sth: db.select().from(users)
  }
}
