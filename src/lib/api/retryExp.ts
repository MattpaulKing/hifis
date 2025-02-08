export default function <T extends Record<string, unknown>>({ route, retries = 3, baseDelayMs = 400 }: { route: string, retries?: number, baseDelayMs?: number }): Promise<T[] | [null]> {
  let attempt = 1
  let fn = async () => {
    let res: T[] = []
    await fetch(route).then(
      async (r) =>
        res = await r.json() as T[]
    );
    if (!res || res.length === 0) {
      throw Error('No res');
    }
    return res;
  }
  async function execute(): Promise<[null] | T[]> {
    try {
      return await fn()
    } catch (error) {
      if (attempt >= retries) {
        return [null]
      }

      const delayMs = baseDelayMs * 2 ** attempt
      await new Promise((resolve) => setTimeout(resolve, delayMs))

      attempt++
      return execute()
    }
  }

  return execute()
}
