
export default class {
  #timeout = $state<ReturnType<typeof setTimeout>>()
  ms = 200
  callback = async () => { return }

  constructor({ callback, ms = 200 }: { callback: () => Promise<void>, ms?: number }) {
    this.callback = callback
    this.ms = ms
  }

  search() {
    if (this.#timeout) clearTimeout(this.#timeout)
    this.#timeout = setTimeout(async () => await this.callback(), this.ms)
  }

}
