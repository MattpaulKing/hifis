import { page } from "$app/state"

type InitParams = { labels: string[], expanded: boolean, activeIdx?: number, disabledPages?: string[], searchKey: string }
export type StepPage = { label: string, getHref: () => string, disabled: () => boolean }

export default class {
  pages = $state<StepPage[]>([])
  disabledPages = $state<string[]>([])
  activeIdx = $state(0)
  activePage = $derived(this.pages[this.activeIdx])
  expanded = $state(false)
  pageIdxMax = $derived(this.pages.length)
  constructor({ labels, expanded, searchKey, disabledPages }: InitParams) {
    this.disabledPages = disabledPages ?? []
    this.pages = labels.map((label, i) => ({
      label,
      getHref: () => {
        return this.setHref(searchKey ?? 'i', i)
      },
      disabled: () => this.disabledPages.includes(label)
    }))
    this.activeIdx = this.initActiveIndex(searchKey)
    this.expanded = expanded
  }
  private setHref(searchKey: string, i: number) {
    let searchParams = page.url.searchParams
    searchParams.set(searchKey, i.toString())
    return new URL(`${page.url.origin}${page.url.pathname}?${searchParams.toString()}`).toString()
  }
  private initActiveIndex(searchKey: string) {
    if (!searchKey) return 0
    let idxString = page.url.searchParams.get(searchKey)
    if (!idxString) return 0
    return parseInt(idxString)
  }
}
