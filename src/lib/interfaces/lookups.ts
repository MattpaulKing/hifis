import type { LookupFieldCtx } from "./Lookup";

export function defaultLookupCtx(): LookupFieldCtx {
  return {
    inputValue: '',
    lookups: []
  }
}
