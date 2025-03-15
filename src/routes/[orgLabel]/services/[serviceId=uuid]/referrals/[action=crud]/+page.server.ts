import { error } from "@sveltejs/kit"
import { serviceReferralCreate, serviceReferralUpdate } from "./actions.server"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ locals: { db } }) => {
  return {

  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case 'create':
        return await serviceReferralCreate(e)
      case 'update':
        return await serviceReferralUpdate(e)
      case 'delete':
        return {}
      default:
        return error(404)
    }
  }
} satisfies Actions
