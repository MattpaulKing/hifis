type InitParams = { pages: StepPage[], expanded: boolean, activeIdx?: number }
export type StepPage = { label: string, href: string, disabled?: boolean }
export default class {
  pages = $state<StepPage[]>([])
  activeIdx = $state(0)
  activePage = $derived(this.pages[this.activeIdx])
  expanded = $state(false)
  pageIdxMax = $derived(this.pages.length)
  constructor({ pages, expanded, activeIdx }: InitParams) {
    this.pages = pages
    this.expanded = expanded
    this.activeIdx = activeIdx ?? 0
  }
}
