import type { Component } from "svelte";

export interface ModalResponse {
  type: "save" | "close"
}

export interface Modal<P extends Record<string, unknown> = {}> {
  id: string
  type: "component" | "prompt"
  routes: { from: string, to: string },
  ref: Component<any>,
  props: Modal["type"] extends "component" ? () => { data: P } : (() => P)
  meta?: Record<string, unknown>
  response: (r: ModalResponse) => void
}

export default class {

  queue = $state<Modal[]>([])
  lastPop: null | Modal = $state(null)
  showing = $derived(this.queue.length > 0)
  showingIdx = $derived(this.queue.length - 1)

  add<P extends Record<string, unknown>>(modal: Omit<Modal<P>, "response" | "id"> & { id?: string, response?: (r: ModalResponse) => void }) {
    let id = modal.id ?? crypto.randomUUID()
    this.queue.push({
      id,
      response: () => null,
      ...modal
    })
  }
  remove(id: string) {
    this.queue.filter(({ id: modalId }) => modalId !== id)
  }
  close() {
    this.lastPop = this.queue.pop() ?? null
  }
  clear() {
    this.queue = []
  }
}
