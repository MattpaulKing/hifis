import type { FormData } from "$src/lib/interfaces/forms"
import type { entitySchema, layoutViewsEnum } from "$src/schemas"
import type { entityAndElementsQueryById } from "../queries/entityAndElementsQueryById.remote"

type EntityAndElements = Awaited<ReturnType<typeof entityAndElementsQueryById>>

function entityElementsArrToLayoutMap<T extends EntityAndElements['fields'] | EntityAndElements['blocks']>(elements: T) {
  return elements.map((element) => ({
    ...element,
    layouts: element.layouts.reduce((agg, curr) => {
      agg[curr.view] = curr
      return agg
    }, { sm: {}, lg: {}, xl: {} } as Record<typeof layoutViewsEnum.enumValues[0], T[0]['layouts'][0]>)
  }))
}


export default function(entity: EntityAndElements) {
  return {
    ...entity,
    fields: entityElementsArrToLayoutMap(entity.fields) as FormData<typeof entitySchema>['fields'],
    blocks: entityElementsArrToLayoutMap(entity.blocks) as FormData<typeof entitySchema>['blocks'],
  }
}
