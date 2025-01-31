import { eq } from "drizzle-orm"
import { clients, clientsFormSchema } from "../schema"
import { single } from "$lib/server/db"
import { services } from "$routes/[orgLabel]/services/schema"
import { clientsServices } from "../services/schema"
import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params: { clientId }, locals: { db } }) => {
  return {
    client: {
      contact: await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientId))
        .then(single),
      services: await db
        .select()
        .from(clientsServices)
        .leftJoin(services, eq(services.id, clientsServices.serviceId))
        .where(eq(clientsServices.clientId, clientId)),
      clientContactForm: await superValidate(valibot(clientsFormSchema))
    }
  }
}

export const actions = {

} satisfies Actions
