import type { PageServerLoad, Actions } from "./$types"
import { logCreate } from "./actions.server"

export const load: PageServerLoad = async ({ locals: { db } }) => {
  return {

  }
}

export const actions = {
  create: async (e) => await logCreate(e),
  update: async (e) => { return }
} satisfies Actions
