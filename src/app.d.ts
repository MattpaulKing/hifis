// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { subjects } from "$lib/auth/subjects";
import type { parse } from "valibot";
import type { users } from "./schemas";

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      subject: {
        type: "user";
        properties: Omit<typeof users.$inferSelect, "createdAt", "updatedAt", "deletedAt">
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
