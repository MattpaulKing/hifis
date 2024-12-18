// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      subject: {
        type: "user";
        properties: {
          email: string;
          orgId: string;
        };
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
