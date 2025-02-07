import { getContext, setContext } from "svelte";
import type { Lookup } from "$lib/interfaces/Lookup";

const LOOKUP_CTX = Symbol("LOOKUP_CTX")
type Args = {
  lookups: Lookup[] | undefined,
  value: string | string[]
  inputValue?: string
}

class LookupStore {
  lookups = $state<(Lookup | undefined)[]>([])
  searching = $state(false)
  inputValue = $state<string>('')

  constructor({ value, lookups, inputValue }: Args) {
    this.lookups = lookups ?? []
    this.inputValue = inputValue ?? ''
  }
}


export function setLookups({ value, inputValue, lookups }: Args) {
  return setContext(LOOKUP_CTX, new LookupStore({ lookups, value, inputValue }))
}
export function getLookups() {
  return getContext<LookupStore>(LOOKUP_CTX)
}
