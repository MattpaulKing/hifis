import { getContext, setContext } from "svelte"
import type { Lookup } from "$src/lib/interfaces/Lookup"
import type { User as UserData } from "$src/lib/auth/subjects"

type UserProps = { user: UserData, clients: Lookup[], services: Lookup[] }

class User {
  properties = $state({} as UserData)
  clients = $state({} as Lookup[])
  services = $state({} as Lookup[])
  constructor({ user, clients, services }: UserProps) {
    this.properties = user
    this.clients = clients
    this.services = services
  }
}

const USER_CTX = Symbol("USER_CTX")
export function setUser({ user, services, clients }: UserProps) {
  return setContext(USER_CTX, new User({ user, services, clients }))
}
export function getUser() {
  return getContext<User>(USER_CTX)
}
