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
  resizeable: boolean,
  active: boolean,
  element: HTMLElement | null,
}
export type CoordsAndSize = {
  id: string,
  x: number,
  y: number,
  widthGridUnits: number,
  heightGridUnits: number
}
