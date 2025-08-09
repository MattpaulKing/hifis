import { createSubjects } from "@openauthjs/openauth";
import { usersSchema } from "../../routes/[orgLabel]/users/schema";
import { organizationsSchema } from "$src/schemas";
import * as v from "valibot"
import type { FormData } from "../interfaces/forms";

export const subjects = createSubjects({
  user: v.object({
    ...usersSchema.entries,
    orgLabel: organizationsSchema.entries.label
  })
})
export type UserSubject = typeof subjects["user"]
export type User = FormData<UserSubject>
