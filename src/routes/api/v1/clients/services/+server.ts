import { clients } from "$routes/[orgLabel]/clients/schema";
import { services } from "$routes/[orgLabel]/services/schema";
import { and, eq, SQL } from "drizzle-orm";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { clientsServices } from "$src/schemas";

export type ApiParams = {
  clientId?: string,
  serviceId?: string,
  lookups?: string
}

type ClientsAndServicesQueryRes = { description: string, client: typeof clients.$inferSelect | null, service: typeof services.$inferSelect | null }

function groupServicesByClient(rows: ClientsAndServicesQueryRes[]) {
  let groupedRows = rows.reduce((acc, row) => {
    const { client, service, description: clientServiceDescription } = row
    if (!client) return acc
    if (!acc[client.id]) {
      acc[client.id] = { ...client, services: [] }
    }
    if (service) {
      acc[client.id].services.push({ ...service, clientServiceDescription })
    }
    return acc
  }, {} as Record<string, typeof clients.$inferSelect & { services: (typeof services.$inferSelect & { clientServiceDescription: string })[] }>)
  return Object.values(groupedRows)
}
export type ClientServicesApiResponse = ReturnType<typeof groupServicesByClient>

export const GET: RequestHandler = async ({ url: { searchParams }, locals: { db } }) => {
  let params: ApiParams = Object.fromEntries(searchParams)

  let filters: SQL[] = []

  if (params.clientId) {
    filters.push(eq(clientsServices.clientId, params.clientId))
  }
  if (params.serviceId) {
    filters.push(eq(clientsServices.serviceId, params.serviceId))
  }

  let clientsAndServices = await db
    .select({
      description: clientsServices.description,
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
