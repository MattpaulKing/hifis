import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/timestamps";

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().notNull(),
  ...timestamps,
  label: text("label"),
  email: text("email"),
})

