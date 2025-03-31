import { createSubjects } from "@openauthjs/openauth";
import { usersSchema } from "../../routes/[orgLabel]/users/schema";
import { organizationsSchema } from "$src/schemas";

export const subjects = createSubjects({
  user: {
    ...usersSchema,
    orgLabel: organizationsSchema.entries.label
  }
})
export type UserSubject = typeof subjects["user"]
