import { browser } from "$app/environment"

export default class {
  // default ms 200
  #timeout = $state<ReturnType<typeof setTimeout>>()
  ms = 200
  callback = async () => { return }
  searching = $state(false)

  constructor({ callback, ms = 200 }: { callback: () => Promise<void>, ms?: number }) {
    this.callback = callback
    this.ms = ms
  }

  search() {
    this.destroy()
    if (browser) {
      this.#timeout = setTimeout(async () => {
        this.searching = false
        return await this.callback()
      }, this.ms)
    }
  }
  destroy() {
    this.searching = true
    if (this.#timeout) {
      clearTimeout(this.#timeout)
    }
  }
}
