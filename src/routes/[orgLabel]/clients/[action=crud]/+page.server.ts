import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { clientCreate, clientUpdate } from "./actions.server";
import { clientContactFormSchema, clients } from "../schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { single } from "$src/lib/server/db";
import type { Actions, PageServerLoad } from "./$types";
import type { FormMode } from "$src/lib/components/forms";
import type { DB } from "$src/lib/server/db/client";

type SearchParams = Partial<{
  clientId: string,
}> & {
  action: FormMode
}

export const load: PageServerLoad = async ({ params, url, locals: { db } }) => {
  let searchParams = {
    ...Object.fromEntries(url.searchParams),
    ...params,
  } as SearchParams
  return {
    searchParams,
    clientContactForm: await getFormData({ searchParams, db }),
  }
}

export const actions = {
  default: async (e) => {
    const { params: { action } } = e
    switch (action) {
      case "create":
        return await clientCreate(e)
      case "update":
        return await clientUpdate(e)
      default:
        error(404)


    }
  }
} satisfies Actions

async function getFormData({ searchParams, db }: { searchParams: SearchParams, db: DB }) {
  const today = new Date()
  if (searchParams.action === "create") {
    return await superValidate({
      dob: new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()),
    }, valibot(clientContactFormSchema), { errors: false })
  } else if (searchParams.clientId) {
    return await superValidate(await db
      .select()
      .from(clients)
      .where(eq(clients.id, searchParams.clientId))
      .then(single), valibot(clientContactFormSchema), { errors: false }
    )
  } else {
    error(404)
  }
}
