import { clients, users } from "$src/schemas";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import * as v from "valibot"

export const usersClients = pgTable('users_clients', {
  ...uuidPK,
  ...timestamps,
  clientId: uuid("client_id").references(() => clients.id, { onUpdate: "cascade", onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
}, (t) => [
  unique('unique_client_id_user_id').on(t.clientId, t.userId)
])

export const usersClientsFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  clientId: v.pipe(v.string(), v.uuid()),
  userId: v.pipe(v.string(), v.uuid()),
})
