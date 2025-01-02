import type { ParamMatcher } from "@sveltejs/kit"

export type CRUD = "create" | "update" | "read" | "delete"

export const match: ParamMatcher = (param) => {
  return param === "create" || param === "update" || param === "read" || param === "delete"
}
