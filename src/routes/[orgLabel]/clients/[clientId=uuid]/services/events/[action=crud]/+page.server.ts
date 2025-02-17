import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { clientServiceEvents, clientServiceEventsFormSchema } from "../schema"
import { eq } from "drizzle-orm"
import { error } from "@sveltejs/kit"
import { clients, services } from "$src/schemas"
import { single } from "$src/lib/server/db"
import { createClientServiceEvents } from "$routes/[orgLabel]/clients/[clientId=uuid]/services/events"
import type { DB } from "$src/lib/server/db/client"
import type { CRUD } from "$src/params/crud"
import type { PageServerLoad, Actions } from "./$types"

type SearchParams = Partial<{
  eventId: string,
  serviceId: string,
}> & {
  clientId: string,
  action: string,
}

export const load: PageServerLoad = async ({ url, params: { action, clientId }, locals: { db } }) => {
  let searchParams = {
    ...Object.fromEntries(url.searchParams),
    action,
    clientId,
  } as SearchParams
  return {
    searchParams,
    client: await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1)
      .then(single),
    service: searchParams.serviceId ? await db
      .select({
        id: services.id,
        label: services.label
      })
      .from(services)
      .where(eq(services.id, searchParams.serviceId))
      .limit(1)
      .then(single) : null,
    excludedServiceEventIds: await db
      .select({ id: clientServiceEvents.id })
      .from(clientServiceEvents)
      .where(eq(clientServiceEvents.clientId, clientId))
      .then(rows => rows.map(({ id }) => id)),
    serviceEventForm: await getValidatedForm({ db, action: action as CRUD, params: searchParams }),
  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case "create":
        return await createClientServiceEvents(e)
      case "update":
        return {}
      case "delete":
        return {}
      default:
        return error(404)
    }
  }

} satisfies Actions

async function getValidatedForm({ db, action, params }: { db: DB, action: CRUD, params: SearchParams }) {
  if (action === "create") {
    return await superValidate({
      id: crypto.randomUUID(),
      clientId: params.clientId,
      serviceId: params.serviceId,
    }, valibot(clientServiceEventsFormSchema), { errors: false })
  } else if (params.eventId) {
    const [clientServiceEvent] = await db
      .select()
      .from(clientServiceEvents)
      .where(eq(clientServiceEvents.id, params.eventId))
      .limit(1)
    return await superValidate({
      ...clientServiceEvent
    }, valibot(clientServiceEventsFormSchema))
  } else {
    return error(404)
  }
}
