import { getContext, setContext } from "svelte";
import type { Lookup, LookupFieldCtx } from "$lib/interfaces/Lookup";

const LOOKUP_CTX = Symbol("LOOKUP_CTX")
type Args = {
  value: string | string[],
} & LookupFieldCtx

class LookupStore {
  inputValue = $state<string>('')
  lookups = $state<(Lookup)[]>([])
  excludedIds = $state<string[]>([])
  searching = $state(false)

  constructor({ value, lookups, inputValue, excludedIds }: Args) {
    this.lookups = lookups ?? []
    this.inputValue = inputValue ?? ''
    this.excludedIds = excludedIds ?? []
  }
  selectedLookups({ $value }: { $value: string | string[] | undefined }) {
    if (!$value) return []
    if (Array.isArray($value)) {
      return this.lookups.filter(lookup => $value.includes(lookup.id))
    } else {
      return this.lookups.filter(lookup => $value === lookup.id)
    }
  }
  filterFetchedLookups({ fetchedLookups, $value }: { fetchedLookups: Lookup[], $value: string[] | string | undefined }) {
    if (Array.isArray($value) && $value.length > 0) {
      this.filterLookupsForArray({ fetchedLookups, $value })
    } else if (typeof $value === "string") {
      this.filterLookupsForStr({ fetchedLookups, $value })
    }
  }
  private filterLookupsForArray({ fetchedLookups, $value }: { fetchedLookups: Lookup[], $value: string[] }) {
    let selectedLookups = this.lookups.filter((lookup) => $value.includes(lookup.id));
    let filteredLookups = fetchedLookups.filter((lookup) => !$value?.includes(lookup.id) && !this.excludedIds.includes(lookup.id))
    this.lookups = [...selectedLookups, ...filteredLookups]
  }
  private filterLookupsForStr({ fetchedLookups, $value }: { fetchedLookups: Lookup[], $value: string }) {
    fetchedLookups = fetchedLookups.filter((lookup) => lookup.id !== $value && !this.excludedIds.includes(lookup.id));
    let selectedLookup = this.lookups.find((lookup) => lookup?.id === $value);
    if (selectedLookup) {
      fetchedLookups.unshift(selectedLookup);
    }
    this.lookups = fetchedLookups;
  }
}


export function setLookups({ value, ...lookupCtx }: Args) {
  return setContext(LOOKUP_CTX, new LookupStore({ value, ...lookupCtx }))
}
export function getLookups() {
  return getContext<LookupStore>(LOOKUP_CTX)
}
