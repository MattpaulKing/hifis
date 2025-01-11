
export default class {
  pageIdx = $state(0)
  pages = $state<string[]>([])
  expanded = $state(false)
  pageIdxMax = $derived(this.pages.length)
  constructor({ pageIdx, pages, expanded }: { pageIdx: number, pages: [], expanded: boolean }) {
    this.pageIdx = pageIdx
    this.pages = pages
    this.expanded = expanded
  }
}
// 	pageIdx: number;
// 	pageIdxMax: number;
// 	pages: string[];
// 	expanded: boolean;
// }
