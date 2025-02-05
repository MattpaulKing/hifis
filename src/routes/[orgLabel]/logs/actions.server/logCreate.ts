import { ar, validateForm } from "$lib/server/forms"
import { logs, logsClients, logsFormSchema, logsServices } from "../schema";
import type { RequestEvent } from "../$types";

export default async function({ request, locals: { db } }: RequestEvent) {
  const form = await validateForm({ request, schema: logsFormSchema })
  if (!form.valid) return ar.invalid({ form })
  let { serviceIds = [], clientIds, ...logData } = form.data
  try {
    const [insertedLog] = await db
      .insert(logs)
      .values(logData)
      .returning()
    form.data.id = insertedLog.id
    if (serviceIds.length > 0) {
      await db
        .insert(logsServices)
        .values(serviceIds.map(serviceId => ({
          logId: insertedLog.id,
          serviceId
        })))

    }
    if (clientIds.length > 0) {
      await db
        .insert(logsClients)
        .values(clientIds.map(clientId => ({
          logId: insertedLog.id,
          clientId
        })))
    }
  } catch (e) {
    console.log(e)
    return ar.dbError({ form })
  }
  return ar.success({ form })
}
