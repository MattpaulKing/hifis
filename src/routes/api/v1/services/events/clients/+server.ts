import { and, eq, getTableColumns, type SQL } from "drizzle-orm";
import { clients, clientServiceEvents, serviceEvents, services } from "$src/schemas";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types"

type ApiParams = Partial<{
  serviceEventId: string;
  clientId: string;
  serviceId: string;
  lookups: string;
}>

export const GET: RequestHandler = async ({ locals: { db }, url: { searchParams } }) => {
  let params = Object.fromEntries(searchParams) as ApiParams
  let filters: SQL[] = []
  if (params.serviceEventId) {
    filters.push(eq(serviceEvents.id, params.serviceEventId))
  }
  if (params.serviceId) {
    filters.push(eq(services.id, params.serviceId))
  }
  if (params.clientId) {
    filters.push(eq(clientServiceEvents.clientId, params.clientId))
  }
  let serviceEventRows = await db
    .select(params.lookups ? { id: clients.id, label: clients.label } : {
      client: getTableColumns(clients),
      serviceEvent: getTableColumns(serviceEvents)
    })
    .from(clientServiceEvents)
    .innerJoin(clients, eq(clients.id, clientServiceEvents.clientId))
    .leftJoin(serviceEvents, eq(serviceEvents.id, clientServiceEvents.serviceEventId))
    .where(and(...filters))

  return json(serviceEventRows)
}
