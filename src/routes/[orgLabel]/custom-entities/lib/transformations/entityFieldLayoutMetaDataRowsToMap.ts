import type { BuildableLayoutMetaData } from "$src/lib/buildable-forms";
import type { entityFieldType } from "$src/schemas";
import type { entityFieldLayoutMetaDataQuery } from "../queries/entityFieldLayoutMetaDataQuery.remote";

export const entityFieldLayoutMetaDataRowsToMap = ({ rows, moveable, resizeable }: { rows: Awaited<ReturnType<typeof entityFieldLayoutMetaDataQuery>>, moveable: boolean, resizeable: boolean }) => {
  return rows.reduce((agg, curr) => {
    agg[curr.entityFieldType] = {
      min: {
        widthGridUnits: curr.minWidthGridUnits,
        heightGridUnits: curr.minHeightGridUnits
      },
      active: false,
      moveable,
      resizeable,
      element: null
    }
    return agg
  }, {} as Record<typeof entityFieldType.enumValues[number], BuildableLayoutMetaData>)
}
