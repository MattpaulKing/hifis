import { eq } from "drizzle-orm"
import { users } from "./users/schema"
import type { PageServerLoad } from "./$types"
import type { TabEntity } from "$src/lib/components/user-grid"
import type { LayoutItem } from "$src/lib/components/user-grid/types"

export const load: PageServerLoad = async ({ locals: { db, subject } }) => {
  return {
    usersComponents: [
      {
        id: '1',
        x: 0,
        y: 0,
        heightGridUnits: 4,
        widthGridUnits: 11,
        min: { heightGridUnits: 1, widthGridUnits: 2 },
        moveable: true,
        resizeable: true
      },
      {
        id: '2',
        x: 11,
        y: 0,
        heightGridUnits: 4,
        widthGridUnits: 11,
        min: { heightGridUnits: 1, widthGridUnits: 2 },
        moveable: true,
        resizeable: true
      }
    ] as LayoutItem[],
    entities: [
      { id: '1', label: 'something', active: false, tabType: "entity" },
      { id: '2', label: 'something else', active: true, tabType: "entity" },
      { id: '3', label: 'sth else', active: false, tabType: "entity" }
    ] as TabEntity[],

    orgsUsers: await db
      .select()
      .from(users)
      .where(eq(users.orgId, subject.properties.orgId))
  }
}
