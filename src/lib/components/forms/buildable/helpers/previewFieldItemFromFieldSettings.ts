import { position2coordinate } from "$src/lib/components/user-grid/utils/item";
import type { ItemSize } from "$src/lib/components/user-grid/types";
import type { FieldSettings } from "../fields";

export default function({ e, fieldSettings: { id, layout: { widthGridUnits, heightGridUnits } }, itemSize, gap }:
  { e: DragEvent, fieldSettings: FieldSettings, itemSize: ItemSize, gap: number }) {
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
