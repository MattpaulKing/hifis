import { position2coordinate } from "$src/lib/components/user-grid/utils/item";
import type { BuildableField } from "../fields";
import type { GridSettings } from "$src/lib/components/user-grid";
import type { InferInput } from "valibot";
import type { entityFieldPositionSchema, entityFieldSchema } from "$src/schemas";

export default function({ e, entityId, field, gridSettings }:
  { e: DragEvent, entityId: string, field: BuildableField, gridSettings: GridSettings }) {
  let { itemSize, gap } = gridSettings
  let widthGridUnits = field.layout.widthGridUnits
  let heightGridUnits = field.layout.heightGridUnits
  let fieldId = crypto.randomUUID()
  let previewEntityField = {
    ...field,
    properties: {
      ...field.properties,
      id: fieldId,
      entityId,
    } satisfies InferInput<typeof entityFieldSchema>,
    layout: {
      ...field.layout,
      id: crypto.randomUUID(),
      fieldId,
      x: position2coordinate(e.clientX, itemSize.width, gap) -
        widthGridUnits,
      y: position2coordinate(e.clientY, itemSize.height, gap) -
        heightGridUnits
    } satisfies InferInput<typeof entityFieldPositionSchema>
  }
  return previewEntityField
}
