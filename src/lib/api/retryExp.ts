export default function <T>({ fn, retries = 3, baseDelayMs = 400 }: { fn: () => Promise<T>, retries?: number, baseDelayMs?: number }) {
  let attempt = 1
  async function execute(): Promise<null | T> {
    try {
      return await fn()
    } catch (error) {
      if (attempt >= retries) {
        console.log(error)
        return null
      }

      const delayMs = baseDelayMs * 2 ** attempt
      await new Promise((resolve) => setTimeout(resolve, delayMs))

      attempt++
      return execute()
    }
  }

  return execute()
}
