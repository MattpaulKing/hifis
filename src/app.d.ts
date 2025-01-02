// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { usersInsertSchema } from "./routes/[organization]/users/schema";
import type { subjects } from "$lib/auth/subjects";
import type { parse } from "valibot";

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      subject: {
        type: "user";
        properties: ReturnType<typeof parse<typeof usersInsertSchema>>
      },
      db: PostgresJsDatabase
    }
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
