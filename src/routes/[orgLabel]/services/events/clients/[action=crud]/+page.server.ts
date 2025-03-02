import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { eq } from "drizzle-orm"
import { error } from "@sveltejs/kit"
import { clients, serviceEvents, services } from "$src/schemas"
import { single } from "$src/lib/server/db"
import { clientServiceEvents, clientServiceEventsFormSchema } from "$routes/[orgLabel]/clients/[clientId=uuid]/services/events/schema"
import { serviceEventClientCreate, serviceEventClientDelete } from "./actions.server"
import type { CRUD } from "$src/params/crud"
import type { PageServerLoad, Actions } from "./$types"

type SearchParams = Partial<{
  serviceEventId: string,
  serviceId: string,
  clientId: string,
}> & {
  action: CRUD,
}

export const load: PageServerLoad = async ({ url, params: { action }, locals: { db } }) => {
  let searchParams = {
    ...Object.fromEntries(url.searchParams),
    action,
  } as SearchParams
  return {
    searchParams,
    client: searchParams.clientId ? await db
      .select()
      .from(clients)
      .where(eq(clients.id, searchParams.clientId))
      .limit(1)
      .then(single) : null,
    service: searchParams.serviceId ? await db
      .select({ id: services.id, label: services.label })
      .from(services)
      .where(eq(services.id, searchParams.serviceId))
      .limit(1)
      .then(single) : null,
    serviceEvent: searchParams.serviceEventId ? await db
      .select({ id: serviceEvents.id, label: serviceEvents.label })
      .from(serviceEvents)
      .where(eq(serviceEvents.id, searchParams.serviceEventId))
      .limit(1)
      .then(single) : null,
    serviceEventAttendeeIds: searchParams.serviceEventId ? await db
      .select({ clientId: clientServiceEvents.clientId })
      .from(clientServiceEvents)
      .where(eq(clientServiceEvents.serviceEventId, searchParams.serviceEventId))
      .then(rows => rows.map(({ clientId }) => clientId)) : [],
    serviceEventClientForm: await getValidatedForm({ params: searchParams }),
  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case 'create':
        return await serviceEventClientCreate(e)
      case 'update':
        return error(404)
      case 'delete':
        return await serviceEventClientDelete(e)
      default:
        return error(404)
    }
  }
} satisfies Actions

async function getValidatedForm({ params }: { params: SearchParams }) {
  return await superValidate({
    id: crypto.randomUUID(),
    clientId: params.clientId,
    serviceId: params.serviceId,
    serviceEventId: params.serviceEventId
  }, valibot(clientServiceEventsFormSchema), { errors: false })
}
