import { preloadData } from "$app/navigation"
import { getContext, setContext, type Component } from "svelte"

type DrawerMeta = {
  id: string;
  href: string;
  response: (r: { type: "save" | "close" }) => void
}

export class DrawerStore {
  isOpen = $state(false)
  queue: DrawerMeta[] = $state([])
  component: null | Component = $state(null)
  componentData: null | Record<string, unknown> = $state(null)
  width: string = $state("w-1/2")
  constructor({ isOpen }: { isOpen: boolean }) {
    this.isOpen = isOpen
  }
  async open<T extends { type: "save" | "close" }>({ ref, href, width = "w-1/2", id = crypto.randomUUID() }: {
    ref: Component, href: string, width?: string, id?: string
  }) {
    let req = await preloadData(href)
    if (req.type !== "loaded") throw Error("Could not load data")
    this.componentData = req.data
    this.component = ref
    this.isOpen = true
    this.width = width
    return new Promise<T>(async (resolve) => {
      this.queue.push({
        id,
        href,
        response: (r) => {
          resolve(r as T)
        }
      })
    })
  }
  close() {
    this.isOpen = false
    this.component = null
    this.componentData = null
  }
}

const DRAWER_CTX = Symbol("DRAWER_CTX")

export function setDrawerStore({ isOpen }: { isOpen: boolean }) {
  return setContext(DRAWER_CTX, new DrawerStore({ isOpen }))
}
export function getDrawerStore() {
  return getContext<DrawerStore>(DRAWER_CTX)
}
