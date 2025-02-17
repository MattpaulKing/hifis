import { getContext, onDestroy, setContext } from "svelte"

type IMessage = { id: string, msg: string, status: "error" | "success" | "in-entry" }

class FormMsg {
  queue: IMessage[] = $state([])
  current = $derived<IMessage | undefined>(this.queue[0] ?? undefined)
  timeoutMap = new Map<string, ReturnType<typeof setTimeout>>()

  constructor() {
    onDestroy(() => {
      this.clear()
    })
  }

  setMsg({ id = crypto.randomUUID(), msg, status }: Omit<IMessage, "id"> & { id?: string }, durationMs = 10000) {
    if (!id) {
      id = crypto.randomUUID()
    }
    this.queue.unshift({ id, msg, status })
    this.timeoutMap.set(
      id,
      setTimeout(() => {
        this.remove(id)
      }, durationMs)
    )
  }
  remove(id: string) {
    const timeout = this.timeoutMap.get(id)
    if (timeout) {
      clearTimeout(timeout)
      this.timeoutMap.delete(id)
    }
    this.queue = this.queue.filter(({ id: msgId }) => msgId !== id)
  }
  clear() {
    for (const [id, timeout] of this.timeoutMap) {
      clearTimeout(this.timeoutMap.get(id))
    }
    this.timeoutMap.clear()
    this.queue = []
  }
}

const FORM_MSG_CTX = Symbol("FORM_MSG_CTX")

export function setFormMsgStore() {
  return setContext(FORM_MSG_CTX, new FormMsg)
}
export function getFormMsgStore() {
  return getContext<FormMsg>(FORM_MSG_CTX)
}
