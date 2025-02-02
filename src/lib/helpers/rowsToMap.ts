type Res<T> = Record<string, T>
export default function <T extends { id: string }>(rows: T[]): Res<T> {
  let res: Res<T> = {}
  for (let i = 0; i < rows.length; i++) {
    if (!(rows[i].id in res)) {
      res[rows[i].id] = rows[i]
    }
  }
  return res
}
