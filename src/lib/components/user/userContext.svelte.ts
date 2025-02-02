import { getContext, setContext } from "svelte"
import { users } from "../../../schemas"

type UserData = typeof users.$inferSelect & { orgLabel: string }

class User {
  properties = $state({} as UserData)
  constructor(user: UserData) {
    this.properties = user
  }
}

const USER_CTX = Symbol("USER_CTX")
export function setUser(user: UserData) {
  return setContext(USER_CTX, new User(user))
}
export function getUser() {
  return getContext<User>(USER_CTX)
}
