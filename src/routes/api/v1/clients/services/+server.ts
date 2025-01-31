import { clients } from "$routes/[orgLabel]/clients/schema";
import { clientsServices } from "$routes/[orgLabel]/clients/services/schema";
import { services } from "$routes/[orgLabel]/services/schema";
import { and, eq, SQL } from "drizzle-orm";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export type ApiParams = {
  clientId?: string,
  serviceId?: string,
  lookups?: string
}

type ClientsAndServicesQueryRes = { client: typeof clients.$inferSelect | null, service: typeof services.$inferSelect | null }

function groupServicesByClient(rows: ClientsAndServicesQueryRes[]) {
  let groupedRows = rows.reduce((acc, row) => {
    const { client, service } = row
    if (!client) return acc
    if (!acc[client.id]) {
      acc[client.id] = { ...client, services: [] }
    }
    if (service) {
      acc[client.id].services.push(service)
    }
    console.log(client)
    return acc
  }, {} as Record<string, typeof clients.$inferSelect & { services: typeof services.$inferSelect[] }>)
  return Object.values(groupedRows)
}

export const GET: RequestHandler = async ({ url: { searchParams }, locals: { db } }) => {
  let params: ApiParams = Object.fromEntries(searchParams)

  let filters: SQL[] = []

  if (params.clientId) {
    filters.push(eq(clientsServices.clientId, clients.id))
  }
  if (params.serviceId) {
    filters.push(eq(clientsServices.serviceId, services.id))
  }

  let clientsAndServices = await db
    .select({
      client: clients,
      service: services
    })
    .from(clientsServices)
    .leftJoin(clients, eq(clientsServices.clientId, clients.id))
    .leftJoin(services, eq(clientsServices.serviceId, services.id))
    .where(and(...filters))
    .then(rows => groupServicesByClient(rows))

  if (params.lookups) {
    return json(
      clientsAndServices.map(client => ({
        id: client.id,
        label: `${client.firstName} ${client.lastName}`,
        services: client.services.map(service => ({
          id: service.id,
          label: service.label
        }))
      })))
  }

  return json(clientsAndServices)
}
