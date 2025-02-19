import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { serviceEventsFormSchema } from "../schema";
import { error } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types"

type SearchParams = Partial<{
  serviceId: string;
}>

export const load: PageServerLoad = async ({ params, url, locals: { db } }) => {
  let searchParams = Object.fromEntries(url.searchParams) as SearchParams
  return {
    params,
    searchParams,
    serviceEventForm: await superValidate({
      id: crypto.randomUUID(),
      serviceId: searchParams.serviceId
    }, valibot(serviceEventsFormSchema), { errors: false })
  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case "create":
        return {}
      case "update":
        return {}
      case "delete":
        return {}
      default:
        return error(404)
    }
  }
} satisfies Actions
