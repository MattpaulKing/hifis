import type { Lookup, LookupFieldCtx } from "./Lookup";

export function lookupCtxDefault(): LookupFieldCtx {
  return {
    inputValue: '',
    lookups: []
  }
}

export function lookupMap<T extends Lookup>(entities: T[]) {
  return entities.map(({ id, label }) => ({
    id,
    label
  }))
}

export function lookupCtxFromSingle<T extends Lookup>({ id, label }: T): LookupFieldCtx {
  return {
    inputValue: label,
    lookups: [{ id, label }]
  }
}
