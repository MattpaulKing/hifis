import { eq, getTableColumns } from "drizzle-orm"
import { clients, clientContactFormSchema } from "../schema"
import { single } from "$lib/server/db"
import { services } from "$routes/[orgLabel]/services/schema"
import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { clientUpdate } from "../actions.server"
import { serviceCategories } from "$routes/[orgLabel]/services/categories/schema"
import { organizations } from "$routes/[orgLabel]/schema"
import { clientsServices } from "$src/schemas"
import { clientsServicesFormSchema } from "./services/schema"
import { rowsToMap } from "$src/lib/helpers"
import { logs, logsFormSchema, logsRelations } from "$routes/[orgLabel]/logs/schema"
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
          ...getTableColumns(services),
          categoryLabel: serviceCategories.label,
          orgLabel: organizations.label,
          clientsServicesDescription: clientsServices.description
        })
        .from(services)
        .leftJoin(organizations, eq(organizations.id, services.orgId))
        .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
        .leftJoin(clientsServices, eq(clientsServices.serviceId, services.id))
        .where(eq(clientsServices.clientId, clientId))
        .then(rowsToMap),
      serviceForm: await superValidate({
        id: crypto.randomUUID(),
        clientId: clientId,
      }, valibot(clientsServicesFormSchema), { errors: false }),
      logs: await db
        .select({
          ...getTableColumns(logs),
          service: {
            id: services.id,
            label: services.label,
          },
          client: {
            id: clients.id,
            label: clients.label,
          }
        })
        .from(logs)
        .leftJoin(logsRelations, eq(logs.id, logsRelations.logId))
        .leftJoin(clients, eq(clients.id, logsRelations.clientId))
        .leftJoin(services, eq(services.id, logsRelations.serviceId))
        .orderBy(logs.id)
        .then(x => {
          console.dir(x, { depth: null })
          return x
        }),
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
