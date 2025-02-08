import { eq } from "drizzle-orm"
import { users } from "./users/schema"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { db, subject } }) => {
  return {
    usersComponents: [
      {
        id: '1',
        label: 'A',
        x: 1,
        y: 1,
        heightGridUnits: 4,
        widthGridUnits: 10,
        min: { heightGridUnits: 1, widthGridUnits: 2 },
        moveable: true,
        resizeable: true
      },
      {
        id: '2',
        label: 'B',
        x: 11,
        y: 1,
        heightGridUnits: 4,
        widthGridUnits: 10,
        min: { heightGridUnits: 1, widthGridUnits: 2 },
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
