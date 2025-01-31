import { uuid } from "drizzle-orm/pg-core";

export const uuidPK = {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
}
