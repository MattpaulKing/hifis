import type { FormData } from "$src/lib/interfaces/forms"
import type { entitySchema, layoutViewsEnum } from "$src/schemas"
import type { getEntityAndElements } from "../queries/queries.remote"

type GetEntityWithElementsRes = Awaited<ReturnType<typeof getEntityAndElements>>

function entityElementsArrToLayoutMap<T extends GetEntityWithElementsRes['fields'] | GetEntityWithElementsRes['blocks']>(elements: T) {
  return elements.map((element) => ({
    ...element,
    layouts: element.layouts.reduce((agg, curr) => {
      agg[curr.view] = curr
      return agg
    }, { sm: {}, lg: {}, xl: {} } as Record<typeof layoutViewsEnum.enumValues[0], T[0]['layouts'][0]>)
  }))
}


export default function(entity: GetEntityWithElementsRes) {
  return {
    ...entity,
    fields: entityElementsArrToLayoutMap(entity.fields) as unknown as FormData<typeof entitySchema>['fields'],
    blocks: entityElementsArrToLayoutMap(entity.blocks) as unknown as FormData<typeof entitySchema>['blocks'],
  }
}
