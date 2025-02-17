import { getRouteData } from '$lib/urls';
import type { modalStore as ModalStore } from '.';
import type { Modal } from './store.svelte';


export default async function <T extends { type: "close" | "save" } | undefined>({ id, routes, ref, modalStore }: {
  id?: string,
  modalStore: ModalStore,
  routes: { from: string, to: string },
  ref: Modal["ref"],
}) {
  return new Promise<T>(async (resolve) => {
    const data = await getRouteData(routes.to)
    if (!data) throw new Error("Could not load data")
    modalStore.add({
      id,
      ref,
      type: "component",
      routes,
      props: () => {
        return { data }
      },
      response: (r) => {
        resolve(r)
      }
    })
  })
}
