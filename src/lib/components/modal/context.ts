import { getContext, setContext } from "svelte";
import { default as modalStore } from "./store.svelte";

const modalCtx = Symbol("MODAL_CTX")

export function setModalStore() {
  return setContext(modalCtx, new modalStore)
}
export function getModalStore(): ReturnType<typeof setModalStore> {
  return getContext(modalCtx)
}
