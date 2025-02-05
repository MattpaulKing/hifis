// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { parse } from "valibot";
import type { users } from "./schemas";
import type { UserSubject } from "$lib/user/userContext";
import * as Schema from "$src/schemas"

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      subject: {
        type: "user";
        properties: UserData
      },
      db: PostgresJsDatabase<typeof Schema>
    }
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
