import { createSubjects } from "@openauthjs/openauth";
import { usersInsertSchema } from "../../routes/[organization]/users/schema";

export const subjects = createSubjects({
  user: usersInsertSchema
})
