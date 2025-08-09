// See https://svelte.dev/docs/kit/types#app.d.ts

import type { parse } from "valibot";
import type { users } from "./schemas";
import type { DB } from "./lib/server/db/client";
import type { User, UserSubject } from "./lib/auth/subjects";

type Subject = {
  type: "user",
  properties: User
}

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      subject: Subject,
      db: DB,
      redirectURI?: string
    }
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
