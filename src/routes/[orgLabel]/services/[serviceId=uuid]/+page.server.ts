import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { services, servicesSchema } from "../schema"
import { eq, getTableColumns } from "drizzle-orm"
import { single } from "$src/lib/server/db"
import { clientContactSchema, clients, clientServiceEvents, clientsServices, serviceCategories, serviceEvents } from "$src/schemas"
import { rowsToMap } from "$src/lib/helpers"
import { serviceEventsSchema } from "../events/schema"
import { clientServiceSchema } from "$routes/[orgLabel]/clients/[clientId=uuid]/services/schema"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ params: { serviceId }, locals: { db } }) => {
  return {
    ...await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .then(single)
      .then(async service => {
        return {
          service,
          serviceForm: await superValidate(service, valibot(servicesSchema), { errors: false }),
        }
      }),
    clients: await db
      .select({
        ...getTableColumns(clients),
        clientServiceDescription: clientsServices.description,
        clientServiceId: clientsServices.id
      })
      .from(clients)
      .innerJoin(clientsServices, eq(clientsServices.clientId, clients.id))
      .where(eq(clientsServices.serviceId, serviceId))
      .then(rowsToMap),
    ...await db
      .select({
        ...getTableColumns(serviceEvents),
        client: { ...getTableColumns(clients) }
      })
      .from(serviceEvents)
      .leftJoin(clientServiceEvents, eq(clientServiceEvents.serviceEventId, serviceEvents.id))
      .leftJoin(clients, eq(clients.id, clientServiceEvents.clientId))
      .where(eq(serviceEvents.serviceId, serviceId))
      .then(rows => rows.reduce((agg, row) => {
        let { client, ...serviceEvent } = row
        if (client?.id && client.id in agg.clientsEvents) {
          agg.clientsEvents[client.id].push(serviceEvent)
        } else if (client?.id) {
          agg.clientsEvents[client.id] = [serviceEvent]
        }
        if (!(row.id in agg.serviceEvents)) {
          agg.serviceEvents[serviceEvent.id] = { ...serviceEvent, attending: {} }
        }
        if (client && !(client.id in agg.serviceEvents[serviceEvent.id].attending)) {
          agg.serviceEvents[serviceEvent.id].attending[client.id] = client
        }
        return agg
      }, { clientsEvents: {}, serviceEvents: {} } as {
        clientsEvents: Record<string, typeof serviceEvents.$inferSelect[]>,
        serviceEvents: Record<string, typeof serviceEvents.$inferSelect & { attending: Record<string, typeof clients.$inferSelect> }>
      })),
    clientContactForm: await superValidate({ id: crypto.randomUUID() }, valibot(clientContactSchema), { errors: false }),
    clientServiceForm: await superValidate({ id: crypto.randomUUID() }, valibot(clientServiceSchema), { errors: false }),
    serviceEventForm: await superValidate({ id: crypto.randomUUID(), serviceId }, valibot(serviceEventsSchema), { errors: false }),
    lookups: {
      serviceCategory: await db
        .select({ id: serviceCategories.id, label: serviceCategories.label })
        .from(serviceCategories)
        .innerJoin(services, eq(services.categoryId, serviceCategories.id))
        .where(eq(services.id, serviceId))
        .then(single)
    }
  }
}

export const actions = {

} satisfies Actions
