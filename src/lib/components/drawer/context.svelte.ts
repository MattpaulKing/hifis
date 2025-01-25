import { preloadData } from "$app/navigation"
import { getContext, setContext, type Component } from "svelte"

class DrawerStore {
  isOpen = $state(false)
  component: null | Component = $state(null)
  componentData: null | Record<string, unknown> = $state(null)
  width: string = $state("w-1/2")
  constructor({ isOpen }: { isOpen: boolean }) {
    this.isOpen = isOpen
  }
  async open({ ref, href, width = "w-1/2" }: { ref: Component, href: string, width?: string }) {
    let req = await preloadData(href)
    if (req.type !== "loaded") throw Error("Could not load data")
    this.componentData = req.data
    this.component = ref
    this.isOpen = true
    this.width = width
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
