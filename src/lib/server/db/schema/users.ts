import { timestamps } from "../helpers/timestamps";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(),
  ...timestamps,
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: varchar('phone', { length: 256 }),
  email: text("email"),
  orgId: uuid("organization_id").references(() => organizations.id)
});
