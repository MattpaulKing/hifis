import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { services, servicesSchema} from "../schema";
import { serviceCreate } from "../actions.server";
import { error } from "@sveltejs/kit";
import { single } from "$src/lib/server/db";
import { eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import type { CRUD } from "$src/params/crud";
import type { DB } from "$src/lib/server/db/client";

type SearchParams = Partial<{
  serviceId: string;
}> & {
  action: CRUD,
  orgId: string
}

export const load: PageServerLoad = async ({ url, params: { action }, locals: { subject, db } }) => {
  let searchParams = {
    ...Object.fromEntries(url.searchParams),
    action,
    orgId: subject.properties.orgId
  } as SearchParams

  return {
    serviceForm: await superValidate(
      await getFormData({ db, searchParams }),
      valibot(servicesFormSchema), { errors: false }
    )
  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case 'create':
        return await serviceCreate(e)
      case 'update':
        return {}
      case 'delete':
        return {}
      default:
        return error(404)
    }
  }
} satisfies Actions

async function getFormData({ db, searchParams }: { db: DB, searchParams: SearchParams }) {
  if (searchParams.action === 'create') {
    return {
      id: crypto.randomUUID(),
      orgId: searchParams.orgId
    }
  } else if (searchParams.serviceId) {
    return await db
      .select()
      .from(services)
      .where(eq(services.id, searchParams.serviceId))
      .then(single)
  } else {
    return error(404)
  }
}
