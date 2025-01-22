import { eq } from "drizzle-orm"
import { users } from "./users/schema"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { db, subject } }) => {
  return {
    usersComponents: [
      {
        id: '1',
        label: 'A',
        x: 0,
        y: 0,
        h: 4,
        w: 10,
        min: { h: 1, w: 2 },
        moveable: false,
        resizeable: true
      },
      {
        id: '2',
        label: 'B',
        x: 10,
        y: 0,
        h: 4,
        w: 10,
        min: { h: 1, w: 2 },
        moveable: true,
        resizeable: true
      }
    ],
    entities: [
      { id: '1', label: 'something', active: false },
      { id: '2', label: 'something else', active: true },
      { id: '3', label: 'sth else', active: false }
    ],

    orgsUsers: await db
      .select()
      .from(users)
      .where(eq(users.orgId, subject.properties.orgId))
  }
}
