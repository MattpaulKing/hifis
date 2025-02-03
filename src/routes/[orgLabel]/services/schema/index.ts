import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { organizations } from "$src/schemas";
import { uuidPK, timestamps } from "$src/schemas/helpers";
import { serviceCategories } from "$src/schemas";
import * as v from "valibot"

export const services = pgTable('services', {
  ...uuidPK,
  ...timestamps,
  label: text('label').notNull(),
  address: text('address').notNull(),
  phone: text('phone'),
  email: text("email"),
  categoryId: uuid("category_id").notNull().references(() => serviceCategories.id, { onUpdate: "cascade", onDelete: "restrict" }),
  description: text("description"),
  orgId: uuid("organization_id").references(() => organizations.id, { onUpdate: "cascade", onDelete: "restrict" }).notNull()
})

export const servicesFormSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  label: v.pipe(v.string("Service's name is required"), v.minLength(1, "Service's name is required")),
  address: v.pipe(v.string("Address is required")),
  phone: v.string(),
  email: v.nullable(v.pipe(v.string(), v.email("Invalid email format"))),
  categoryId: v.pipe(v.string("Category is required"), v.uuid()),
  description: v.string(),
  orgId: v.pipe(v.string(), v.uuid())
})
