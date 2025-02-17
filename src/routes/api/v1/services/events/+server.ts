import { and, eq, getTableColumns, type SQL } from "drizzle-orm";
import { serviceEvents, services } from "$src/schemas";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types"

type ApiParams = Partial<{
  serviceId: string;
  serviceEventId: string;
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
  let serviceEventRows = await db
    .select(params.lookups ? {
      id: serviceEvents.id,
      label: serviceEvents.label,
      startTS: serviceEvents.startTS,
      endTS: serviceEvents.endTS
    } : getTableColumns(serviceEvents))
    .from(serviceEvents)
    .innerJoin(services, eq(services.id, serviceEvents.serviceId))
    .where(and(...filters))

  if (params.lookups) {
    return json(serviceEventRows.map(row => ({
      id: row.id,
      label: row.label,
      description: row.startTS.toDateString(),
      descriptionExtra: `${fmtDuration(row.startTS)} - ${fmtDuration(row.endTS)}`
    })))
  }

  return json(serviceEventRows)
}

function fmtDuration(d: Date) {
  let utcHours = d.getUTCHours()
  let isAM = utcHours < 12
  return `${isAM ? utcHours : utcHours - 12}:${d.getUTCMinutes()} ${isAM ? 'AM' : 'PM'}`
}
