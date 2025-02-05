export default function <T extends { id: string }>(rows: T[]): Record<string, T> {
  let res: Record<string, T> = {}
  for (let i = 0; i < rows.length; i++) {
    if (!(rows[i].id in res)) {
      res[rows[i].id] = rows[i]
    }
  }
  return res
}
