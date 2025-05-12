import { getContext, onDestroy, setContext } from "svelte"

export interface IToast {
  id: string,
  message: string,
  type: "save" | "info" | "error",
}
const toastCtx = Symbol("TOAST_CTX")

export class Toaster {

  queue: IToast[] = $state([])
  timeoutMap = new Map<string, ReturnType<typeof setTimeout>>()

  constructor() {
    onDestroy(() => {
      this.clear()
    })
  }

  add(toast: Omit<IToast, "id"> & { id?: string }, durationMs = 5000) {
    let id = toast.id ?? crypto.randomUUID()
    let newToast = {
      id,
      ...toast,
    }
    this.queue.push(newToast)
    this.timeoutMap.set(
      id,
      setTimeout(() => {
        this.remove(id)
      }, durationMs)
    )
  }

  clear() {
    for (const timeout of this.timeoutMap.values()) {
      clearTimeout(timeout)
    }
    this.timeoutMap.clear()
    this.queue = []
  }

  remove(id: string) {
    const timeout = this.timeoutMap.get(id)
    if (timeout) {
      clearTimeout(timeout)
      this.timeoutMap.delete(id)
    }
    this.queue = this.queue.filter(({ id: toastId }) => toastId !== id)
  }
}

export function setToaster() {
  return setContext(toastCtx, new Toaster())
}
export function getToaster(): Toaster {
  return getContext(toastCtx)
}
