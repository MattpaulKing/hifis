import { error } from "@sveltejs/kit"

export default async function <T>({ fn, errorMsg }: { fn: PromiseLike<T>, errorMsg: string }) {
  try {
    return await fn
  } catch (e) {
    console.log(e)
    return error(500, errorMsg)
  }
}
