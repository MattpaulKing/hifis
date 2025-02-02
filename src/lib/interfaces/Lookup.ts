export type Lookup = { id: string, label: string, description?: string | null }
export type LookupFieldCtx = {
  lookups: Lookup[];
  inputValue: string;
  excludedIds?: string[]
}
