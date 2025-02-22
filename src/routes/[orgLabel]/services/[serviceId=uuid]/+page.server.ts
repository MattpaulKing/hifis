import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { services, servicesFormSchema } from "../schema"
import { eq, getTableColumns } from "drizzle-orm"
import { single } from "$src/lib/server/db"
import { clients, clientServiceEvents, clientsServices, serviceCategories, serviceEvents } from "$src/schemas"
import { rowsToMap } from "$src/lib/helpers"
import { clientContactFormSchema } from "$routes/[orgLabel]/clients/schema"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ params: { serviceId }, locals: { db } }) => {
  return {
    serviceForm: await superValidate(
      await db
        .select()
        .from(services)
        .where(eq(services.id, serviceId))
        .then(single),
      valibot(servicesFormSchema), { errors: false }),
    clients: await db
      .select({
        ...getTableColumns(clients),
        clientServiceDescription: clientsServices.description
      })
      .from(clients)
      .innerJoin(clientsServices, eq(clientsServices.clientId, clients.id))
      .where(eq(clientsServices.serviceId, serviceId))
      .then(rowsToMap),
    ...await db
      .select({
        ...getTableColumns(serviceEvents),
        clientId: clientServiceEvents.clientId
      })
      .from(clientServiceEvents)
      .innerJoin(serviceEvents, eq(clientServiceEvents.serviceEventId, serviceEvents.id))
      .where(eq(serviceEvents.serviceId, serviceId))
      .then(rows => rows.reduce((agg, row) => {
        if (row.clientId in agg) {
          agg.clientsEvents[row.clientId].push(row)
        } else {
          agg.clientsEvents[row.clientId] = [row]
        }
        if (row.id in agg.servicesEvents) {
          agg.servicesEvents[row.id].push(row)
        } else {
          agg.servicesEvents[row.id] = [row]
        }
        return agg
      }, { clientsEvents: {}, servicesEvents: {} } as {
        clientsEvents: Record<string, typeof serviceEvents.$inferSelect[]>,
        servicesEvents: Record<string, typeof serviceEvents.$inferSelect[]>
      })),
    clientContactForm: await superValidate(valibot(clientContactFormSchema)),
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
