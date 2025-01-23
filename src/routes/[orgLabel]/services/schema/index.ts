import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { timestamps } from "../../../../schemas/helpers/timestamps";
import { organizations } from "../../schema";
import * as v from "valibot"

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  ...timestamps,
  label: text('label').notNull(),
  address: text('address').notNull(),
  phone: text('phone'),
  email: text("email"),
  orgId: uuid("organization_id").references(() => organizations.id).notNull()
})

export const servicesFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  label: v.string("Service's name is required"),
  address: v.pipe(v.string("Address is required")),
  phone: v.nullable(v.string()),
  email: v.nullable(v.pipe(v.string(), v.email())),
  orgId: v.pipe(v.string(), v.uuid())
})
