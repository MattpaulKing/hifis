// See https://svelte.dev/docs/kit/types#app.d.ts

import type { parse } from "valibot";
import type { users } from "./schemas";
import type { DB } from "./lib/server/db/client";
import type { UserData } from "./lib/components/user/userContext.svelte";

type Subject = {
  type: "user",
  properties: UserData
}

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      subject: Subject,
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
