import { position2coordinate } from "$src/lib/components/user-grid/utils/item";
import type { BuildableField } from "../fields";
import type { GridSettings } from "$src/lib/components/user-grid";

export default function({ e, field, gridSettings }:
  { e: DragEvent, field: BuildableField, gridSettings: GridSettings }) {
  let { itemSize, gap } = gridSettings
  let widthGridUnits = field.layout.widthGridUnits
  let heightGridUnits = field.layout.heightGridUnits
  field = {
    ...field,
    id: crypto.randomUUID(),
    layout: {
      ...field.layout,
      id: crypto.randomUUID(),
      x: position2coordinate(e.clientX, itemSize.width, gap) -
        widthGridUnits,
      y: position2coordinate(e.clientY, itemSize.height, gap) -
        heightGridUnits
    }
  }
  return field
}
