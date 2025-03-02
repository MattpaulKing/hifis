import { and, eq, getTableColumns, gte, type SQL } from "drizzle-orm";
import { clientServiceEvents, serviceEvents, services } from "$src/schemas";
import { json } from "@sveltejs/kit";
import { fmtTime } from "$src/lib/helpers";
import type { RequestHandler } from "./$types"

type ApiParams = Partial<{
  serviceId: string;
  serviceEventId: string;
  lookups: string;
  'startTS.gte': string;
  endTS: string;
  clientId: string;
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
  if (params["startTS.gte"]) {
    filters.push(gte(serviceEvents.startTS, new Date(params["startTS.gte"])))
  }
  if (params.clientId) {
    filters.push(eq(clientServiceEvents.clientId, params.clientId))
  }
  let serviceEventRows = await db
    .select(params.lookups ? {
      id: serviceEvents.id,
      label: serviceEvents.label,
      startTS: serviceEvents.startTS,
      endTS: serviceEvents.endTS
    } : getTableColumns(serviceEvents))
    .from(serviceEvents)
    .innerJoin(services, eq(services.id, serviceEvents.serviceId))
    .leftJoin(clientServiceEvents, eq(clientServiceEvents.serviceEventId, serviceEvents.id))
    .where(and(...filters))

  if (params.lookups) {
    return json(serviceEventRows.map(row => ({
      id: row.id,
      label: row.label,
      description: row.startTS.toDateString(),
      descriptionExtra: `${fmtTime(row.startTS)} - ${fmtTime(row.endTS)}`
    })))
  }

  return json(serviceEventRows)
}
