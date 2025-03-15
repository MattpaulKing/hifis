import { getGridDimensions, hasCollisions } from "./grid";
import type { LayoutItem } from "../types";

export function getAvailablePosition(currentItem: LayoutItem, items: LayoutItem[], maxCols: number, maxRows: number) {
  let { cols, rows } = getGridDimensions(items);
  if (maxCols < Infinity)
    cols = maxCols;
  if (maxRows < Infinity)
    rows = maxRows;
  for (let y = 0; y <= rows - currentItem.heightGridUnits; y++) {
    for (let x = 0; x <= cols - currentItem.widthGridUnits; x++) {
      const item = { ...currentItem, x, y };
      if (!hasCollisions(item, items)) {
        const newPosition = { x, y };
        return newPosition;
      }
    }
  }
  if (maxRows === Infinity)
    return { x: 0, y: rows };
  if (maxCols === Infinity)
    return { x: cols, y: 0 };
  return null;
}
