import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import { serviceEvents, serviceEventsFormSchema } from "../schema";
import { error } from "@sveltejs/kit";
import { single } from "$src/lib/server/db";
import { eq } from "drizzle-orm";
import { serviceEventCreate, serviceEventUpdate } from "./actions.server";
import type { PageServerLoad, Actions } from "./$types"
import type { CRUD } from "$src/params/crud";
import type { DB } from "$src/lib/server/db/client";

type SearchParams = Partial<{
  serviceId: string;
  serviceEventId: string;
}> & {
  action: CRUD
}

export const load: PageServerLoad = async ({ params, url, locals: { db } }) => {
  let searchParams = {
    ...Object.fromEntries(url.searchParams),
    action: params.action
  } as SearchParams
  return {
    searchParams,
    serviceEventForm: await getFormData({ db, searchParams })
  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case "create":
        return await serviceEventCreate(e)
      case "update":
        return await serviceEventUpdate(e)
      case "delete":
        return {}
      default:
        return error(404)
    }
  }
} satisfies Actions

async function getFormData({ db, searchParams }: { db: DB, searchParams: SearchParams }) {
  if (searchParams.action === "create") {
    return await superValidate({
      id: crypto.randomUUID(),
      serviceId: searchParams.serviceId
    }, valibot(serviceEventsFormSchema), { errors: false })
  } else if (searchParams.serviceEventId) {
    return await superValidate(
      await db
        .select()
        .from(serviceEvents)
        .where(eq(serviceEvents.id, searchParams.serviceEventId))
        .limit(1)
        .then(single), valibot(serviceEventsFormSchema), { errors: false })
  } else {
    return error(404)
  }
}
