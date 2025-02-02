import { uuid } from "drizzle-orm/pg-core";

const uuidPK = {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
}
export default uuidPK
