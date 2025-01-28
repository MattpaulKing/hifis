export type Lookup = { id: string, label: string, description?: string }
export type LookupFieldCtx = {
  lookups?: Lookup[];
  inputValue?: string;
}
