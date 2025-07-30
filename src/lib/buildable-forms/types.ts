import type { entityBlockLayoutSchema, entityBlocksSchema, entityFieldLayoutSchema, entityFieldsSchema } from "$src/schemas"
import type { FormData } from "../interfaces/forms"

export type BuildableField = {
  properties: FormData<typeof entityFieldsSchema>,
  layout: FormData<typeof entityFieldLayoutSchema> & BuildableLayoutMetaData,
}

export type BuildableBlock = {
  properties: FormData<typeof entityBlocksSchema>,
  layout: FormData<typeof entityBlockLayoutSchema> & BuildableLayoutMetaData,
}

export type BuildableLayoutMetaData = {
  min: {
    widthGridUnits: number,
    heightGridUnits: number
  },
  max?: {
    widthGridUnits: number,
    heightGridUnits: number
  }
  moveable: boolean,
  resizeable: boolean
}
export type CoordsAndSize = {
  id: string,
  x: number,
  y: number,
  widthGridUnits: number,
  heightGridUnits: number
}
