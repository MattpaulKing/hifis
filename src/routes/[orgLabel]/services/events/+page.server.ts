import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { serviceEventsSchema } from "./schema"
import type { PageServerLoad, Actions } from "./$types"

type SearchParams = Partial<{
  serviceId: string;
}>

export const load: PageServerLoad = async ({ url: { searchParams }, locals: { db } }) => {
  let searchParamsObj = Object.fromEntries(searchParams) as SearchParams
  return {
    serviceEventForm: await superValidate({
      id: crypto.randomUUID(),
      serviceId: searchParamsObj.serviceId
    }, valibot(serviceEventsSchema), { errors: false })
  }
}

export const actions = {

} satisfies Actions
