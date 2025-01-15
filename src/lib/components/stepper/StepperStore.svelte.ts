import { page } from "$app/state"

export type StepPage = { label: string, href: string, disabled?: boolean }
export default class {
  pages = $state<StepPage[]>([])
  expanded = $state(false)
  pageIdxMax = $derived(this.pages.length)
  pageIdx = $derived(this.pages.findIndex(stepPage => stepPage.href === `${page.url.pathname}${page.url.search}`))
  constructor({ pages, expanded }: { pages: StepPage[], expanded: boolean }) {
    this.pages = pages
    this.expanded = expanded
  }
}
