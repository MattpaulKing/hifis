import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { clientsServicesFormSchema } from "../schema";
import { defaultLookupCtx } from "$lib/interfaces";
import { clients } from "../../schema";
import { eq } from "drizzle-orm";
import { services } from "$routes/[orgLabel]/services/schema";
import type { PageServerLoad } from "./$types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type SearchParams = {
  clientId?: string,
  serviceId?: string
}

export const load: PageServerLoad = async ({ url: { searchParams }, locals: { db } }) => {
  let params: SearchParams = Object.fromEntries(searchParams)
  return {
    clientServiceForm: await superValidate({
      id: crypto.randomUUID(),
      clientId: params.clientId,
      serviceId: params.serviceId,
    }, valibot(clientsServicesFormSchema), { errors: false }),
    lookups: await getLookups({ db, params }),
  }
}

async function getLookups({ db, params }: { db: PostgresJsDatabase, params: SearchParams }) {
  let lookups = { client: defaultLookupCtx(), service: defaultLookupCtx() }
  if (params.clientId) {
    let [clientLookup] = await db
      .select({ id: clients.id, label: clients.label })
      .from(clients)
      .where(eq(clients.id, params.clientId))
      .limit(1)
    lookups.client = {
      inputValue: clientLookup.label,
      lookups: [clientLookup]
    }
  }
  if (params.serviceId) {
    let [serviceLookup] = await db
      .select({ id: services.id, label: services.label })
      .from(services)
      .where(eq(services.id, params.serviceId))
    lookups.service = {
      inputValue: serviceLookup.label,
      lookups: [serviceLookup]
    }
  }
  return lookups
}
