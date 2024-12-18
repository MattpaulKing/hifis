import { drizzle } from "drizzle-orm/node-postgres";
import { Resource } from "sst";

export const db = drizzle(`postgres://${Resource.db.username}:${Resource.db.password}@${Resource.db.host}:${Resource.db.port}/${Resource.db.database}`)
