import type { PageServerLoad, Actions } from "./$types"
import { clients } from "./schema"

export const load: PageServerLoad = async ({ locals: { db } }) => {
  return {
    clients: await db
      .select()
      .from(clients)
  }
}

export const actions = {

} satisfies Actions
