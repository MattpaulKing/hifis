import { eq, exists } from "drizzle-orm"
import { clients, clientContactFormSchema } from "../schema"
import { single } from "$lib/server/db"
import { services } from "$routes/[orgLabel]/services/schema"
import { clientsServices, clientsServicesFormSchema } from "../services/schema"
import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import clientUpdate from "../actions.server/clientUpdate"
import type { Actions, PageServerLoad } from "./$types"

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
        .select()
        .from(services)
        .where(
          exists(
            db.select()
              .from(clientsServices)
              .where(eq(clientsServices.clientId, clientId))
          )),
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
