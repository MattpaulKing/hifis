// See https://svelte.dev/docs/kit/types#app.d.ts

import type { parse } from "valibot";
import type { users } from "./schemas";
import type { UserSubject } from "$lib/user/userContext";
import type { DB } from "./lib/server/db/client";

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      subject: {
        type: "user";
        properties: UserData
      },
      db: DB
    }
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
