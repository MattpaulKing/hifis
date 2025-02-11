export default function <K extends keyof T & string, T extends { id: string } & Record<string, unknown>>(rows: T[], key?: K): Record<string, T> {
  let res: Record<string, T> = {}
  let _key = key ?? 'id' as keyof T | string
  for (let i = 0; i < rows.length; i++) {
    let idKeyVal = rows[i][_key] as string
    if (!(idKeyVal in res)) {
      res[idKeyVal] = rows[i]
    }
  }
  return res
}
