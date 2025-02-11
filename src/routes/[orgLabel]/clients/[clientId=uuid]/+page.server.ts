import { eq } from "drizzle-orm"
import { clients, clientContactFormSchema } from "../schema"
import { single } from "$lib/server/db"
import { services } from "$routes/[orgLabel]/services/schema"
import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { clientUpdate } from "../actions.server"
import { serviceCategories } from "$routes/[orgLabel]/services/categories/schema"
import { organizations } from "$routes/[orgLabel]/schema"
import { clientServiceEvents, clientsServices, serviceEvents } from "$src/schemas"
import { clientServiceFormSchema } from "./services/schema"
import { rowsToMap } from "$src/lib/helpers"
import { logsFormSchema } from "$routes/[orgLabel]/logs/schema"
import { logsWithClientsAndServices, aggLogsWitsClientsAndServices } from "$routes/[orgLabel]/logs/lib"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ url: { searchParams }, params: { clientId }, locals: { db } }) => {
  let params = Object.fromEntries(searchParams)
  params.clientId = clientId
  return {
    client: {
      ...await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientId))
        .then(single)
        .then(async contact => ({
          contact,
          contactForm: await superValidate({
            ...contact
          }, valibot(clientContactFormSchema))
        })),
      services: await db
        .select({
          id: services.id,
          label: services.label,
          categoryLabel: serviceCategories.label,
          orgLabel: organizations.label,
          clientServiceDescription: clientsServices.description
        })
        .from(services)
        .innerJoin(organizations, eq(organizations.id, services.orgId))
        .innerJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
        .innerJoin(clientsServices, eq(clientsServices.serviceId, services.id))
        .where(eq(clientsServices.clientId, clientId))
        .then(rowsToMap),
      serviceForm: await superValidate({
        id: crypto.randomUUID(),
        clientId: clientId,
      }, valibot(clientServiceFormSchema), { errors: false }),
      serviceEvents: await db
        .query.clientServiceEvents.findMany({
          columns: {},
          with: {
            serviceEvents: true
          },
          where: eq(clientServiceEvents.clientId, clientId)
        }).then(rows => rows.reduce((servicesEvents, { serviceEvents: serviceEvent }) => {
          if (serviceEvent.serviceId in serviceEvents) {
            servicesEvents[serviceEvent.serviceId].push(serviceEvent)
          } else {
            servicesEvents[serviceEvent.serviceId] = [serviceEvent]
          }
          return servicesEvents
        }, {} as Record<string, typeof serviceEvents.$inferSelect[]>)),
      logs: await db
        .query.logs.findMany({ ...logsWithClientsAndServices })
        .then(aggLogsWitsClientsAndServices),
      logForm: await superValidate({
        id: crypto.randomUUID(),
        clientIds: [clientId]
      }, valibot(logsFormSchema), { errors: false })
    },
  }
}

export const actions = {
  update: async (e) => await clientUpdate(e)
} satisfies Actions
