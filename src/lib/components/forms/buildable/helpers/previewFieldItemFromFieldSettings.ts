import { position2coordinate } from "$src/lib/components/user-grid/utils/item";
import type { FieldSettings } from "../fields";
import type { GridSettings } from "$src/lib/components/user-grid";

export default function({ e, fieldSettings: { id, layout: { widthGridUnits, heightGridUnits } }, gridSettings }:
  { e: DragEvent, fieldSettings: FieldSettings, gridSettings: GridSettings }) {
  let { itemSize, gap } = gridSettings
  return {
    id,
    x:
      position2coordinate(e.pageX, itemSize.width, gap) -
      widthGridUnits,
    y:
      position2coordinate(e.pageY, itemSize.height, gap) -
      heightGridUnits,

    widthGridUnits,
    heightGridUnits,
    min: {
      widthGridUnits,
      heightGridUnits
    },
    moveable: true,
    resizeable: true
  }
}
