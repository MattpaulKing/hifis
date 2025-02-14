import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ locals: { db } }) => {
  return {

  }
}

export const actions = {
  edit: async (e) => {
    return
  }
} satisfies Actions
