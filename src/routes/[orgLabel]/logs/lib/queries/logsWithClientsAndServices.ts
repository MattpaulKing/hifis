import type { db } from "$src/lib/server/db"

const withClientsAndServices = {
  columns: { id: true, note: true, createdAt: true },
  with: {
    logsClients: {
      columns: {},
      with: {
        clients: {
          columns: { id: true, label: true },
        }
      },
    },
    logsServices: {
      columns: {},
      with: {
        services: {
          columns: { id: true, label: true },
        }
      }
    }
  },
} as const
export default withClientsAndServices

export function aggLogsWitsClientsAndServices(logs: Awaited<ReturnType<ReturnType<typeof db.query.logs.findMany<typeof withClientsAndServices>>["execute"]>>) {
  let res = logs.map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    label: row.createdAt,
    note: row.note,
    clients: row.logsClients.map(({ clients }) => clients),
    services: row.logsServices.map(({ services }) => services)
  }))
  return res.reduce((agg, row) => {
    if (row.id in agg) {
      console.log("?????? how log sus on god")
    } else {
      agg[row.id] = row
    }
    return agg
  }, {} as Record<string, typeof res[0]>)
}
