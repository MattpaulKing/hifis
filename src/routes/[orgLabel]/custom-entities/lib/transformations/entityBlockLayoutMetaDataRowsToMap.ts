import type { BuildableLayoutMetaData } from "$src/lib/buildable-forms";
import type { entityBlockType } from "$src/schemas";
import type { entityBlockLayoutMetaDataQuery } from "../queries/entityBlockLayoutMetaDataQuery.remote";

export const entityBlockLayoutMetaDataRowsToMap = ({ rows, moveable, resizeable }: { rows: Awaited<ReturnType<typeof entityBlockLayoutMetaDataQuery>>, moveable: boolean, resizeable: boolean }) => {
  return rows.reduce((agg, curr) => {
    agg[curr.entityBlockType] = {
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
  }, {} as Record<typeof entityBlockType.enumValues[number], BuildableLayoutMetaData>)
}
