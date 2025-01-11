import { createSubjects } from "@openauthjs/openauth";
import { usersFormSchema } from "../../routes/[orgLabel]/users/schema";

export const subjects = createSubjects({
  user: usersFormSchema
})
