import { services, users } from "$src/schemas";
import { timestamps, uuidPK } from "$src/schemas/helpers";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import * as v from "valibot"

export const usersServices = pgTable('users_services', {
  ...uuidPK,
  ...timestamps,
  serviceId: uuid("serviceId").references(() => services.id, { onUpdate: "cascade", onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
}, (t) => [
  unique('unique_service_id_user_id').on(t.serviceId, t.userId)
])

export const usersClientsFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  serviceId: v.pipe(v.string(), v.uuid()),
  userId: v.pipe(v.string(), v.uuid()),
})
