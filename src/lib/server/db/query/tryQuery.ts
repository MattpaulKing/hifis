import { error } from "@sveltejs/kit"

export default async function tryQuery<T>({ fn, errorMsg, retries = 0 }: { fn: PromiseLike<T>, errorMsg: string, retries?: number }) {
  try {
    return await fn
  } catch (e) {
    if (retries < 3) return await tryQuery({ fn, errorMsg, retries: retries + 1 })
    console.log(e)
    return error(500, errorMsg)
  }
}
