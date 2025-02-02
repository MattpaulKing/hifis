import { eq, exists, getTableColumns } from "drizzle-orm"
import { clients, clientContactFormSchema } from "../schema"
import { single } from "$lib/server/db"
import { services } from "$routes/[orgLabel]/services/schema"
import { clientsServices, clientsServicesFormSchema } from "../services/schema"
import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import clientUpdate from "../actions.server/clientUpdate"
import type { Actions, PageServerLoad } from "./$types"
import { serviceCategories } from "$routes/[orgLabel]/services/categories/schema"
import { organizations } from "$routes/[orgLabel]/schema"

// type Params = 

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
          orgLabel: organizations.label
        })
        .from(services)
        .leftJoin(organizations, eq(organizations.id, services.orgId))
        .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
        .where(
          exists(
            db.select()
              .from(clientsServices)
              .where(eq(clientsServices.clientId, clientId))
          )).then(rowsToMap),
      serviceForm: await superValidate({
        id: crypto.randomUUID(),
        clientId: clientId,
      }, valibot(clientsServicesFormSchema), { errors: false })
    },
  }
}

export const actions = {
  update: async (e) => await clientUpdate(e)
} satisfies Actions

function rowsToMap<T extends { id: string }>(rows: T[]): Record<string, T> {
  let res: Record<string, T> = {}
  for (let i = 0; i < rows.length; i++) {
    if (!(rows[i].id in res)) {
      res[rows[i].id] = rows[i]
    }
  }
  return res
}
