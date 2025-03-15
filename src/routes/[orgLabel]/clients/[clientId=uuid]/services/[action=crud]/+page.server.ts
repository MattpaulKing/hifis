import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { clientsServices } from "../schema";
import { lookupCtxDefault } from "$lib/interfaces";
import { and, eq } from "drizzle-orm";
import { services } from "$routes/[orgLabel]/services/schema";
import { clientServiceCreate, clientServiceUpdate } from "./actions.server";
import { clients } from "$routes/[orgLabel]/clients/schema";
import { error } from "@sveltejs/kit";
import { servicesReferralsFormSchema } from "$routes/[orgLabel]/services/[serviceId=uuid]/referrals/schema";
import type { Actions, PageServerLoad } from "../[action=crud]/$types";
import type { DB } from "$src/lib/server/db/client";
import type { CRUD } from "$src/params/crud";

type SearchParamsObj = {
  clientId?: string,
  serviceId?: string
}

export const load: PageServerLoad = async ({ url, params: { action }, locals: { db } }) => {
  let params: SearchParamsObj = Object.fromEntries(url.searchParams)
  return {
    serviceReferralForm: await getFormData({ action: action as CRUD, params, db }),
    action: action as CRUD,
    lookups: await getLookups({ db, params }),
  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case "create":
        return await clientServiceCreate(e)
      case "update":
        return await clientServiceUpdate(e)
      default:
        return error(404)
    }
  }
} satisfies Actions

async function getLookups({ db, params }: { db: DB, params: SearchParamsObj }) {
  let lookups = { clients: lookupCtxDefault(), services: lookupCtxDefault() }
  if (params.clientId) {
    let [clientLookup] = await db
      .select({ id: clients.id, label: clients.label })
      .from(clients)
      .where(eq(clients.id, params.clientId))
      .limit(1)
    lookups.clients = {
      inputValue: clientLookup.label,
      lookups: [clientLookup]
    }
  }
  if (params.serviceId) {
    let [serviceLookup] = await db
      .select({ id: services.id, label: services.label })
      .from(services)
      .where(eq(services.id, params.serviceId))
    lookups.services = {
      inputValue: serviceLookup.label,
      lookups: [serviceLookup]
    }
  }
  return lookups
}

async function getFormData({ db, action, params }: { db: DB, action: CRUD, params: SearchParamsObj }) {
  if (action === "create") {
    return await superValidate({
      id: crypto.randomUUID(),
      clientId: params.clientId,
      serviceId: params.serviceId,
    }, valibot(servicesReferralsFormSchema), { errors: false })
  } else if (params.clientId && params.serviceId) {
    const [clientService] = await db
      .select()
      .from(clientsServices)
      .where(and(
        eq(clientsServices.clientId, params.clientId),
        eq(clientsServices.serviceId, params.serviceId)
      ))
      .limit(1)
    return await superValidate({
      ...clientService
    }, valibot(servicesReferralsFormSchema))
  } else {
    return error(404)
  }
}
