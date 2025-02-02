import { createSubjects } from "@openauthjs/openauth";
import { usersFormSchema } from "../../routes/[orgLabel]/users/schema";
import { organizationInsertSchema } from "$routes/[orgLabel]/schema";

export const subjects = createSubjects({
  user: {
    ...usersFormSchema,
    orgLabel: organizationInsertSchema.entries.label
  }
})
export type UserSubject = typeof subjects["user"]
