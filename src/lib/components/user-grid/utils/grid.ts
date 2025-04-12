import { calcPosition } from './item';
import type { BuildableFieldPreview } from '../../forms';
import type { GridDimensions, LayoutItem } from '../types';
import type { GridSettings } from './GridContext.svelte';

export function isItemColliding(currentItem: LayoutItem, item: LayoutItem): boolean {
  return (currentItem.id !== item.id &&
    currentItem.x <= item.x + item.widthGridUnits - 1 &&
    currentItem.y <= item.y + item.heightGridUnits - 1 &&
    currentItem.x + currentItem.widthGridUnits - 1 >= item.x &&
    currentItem.y + currentItem.heightGridUnits - 1 >= item.y);
}
export function getCollisions(currentItem: LayoutItem, items: LayoutItem[]): LayoutItem[] {
  return items.filter((item) => isItemColliding(currentItem, item));
}

export function hasCollisions(currentItem: LayoutItem, items: LayoutItem[]): boolean {
  return items.some((item) => isItemColliding(currentItem, item));
}

export function getGridDimensions(items: LayoutItem[]): GridDimensions {
  let cols = 0;
  let rows = 0;
  items.forEach((item) => {
    cols = Math.max(cols, item.x + item.widthGridUnits);
    rows = Math.max(rows, item.y + item.heightGridUnits);
  });
  return { cols, rows };
}
export function isOutsideBounds({ left, top, width, height }: { left: number, top: number, width: number, height: number }, rect: DOMRect | undefined) {
  if (!rect) return false
  return left <= 0 || top <= 0 || rect.left + left + width > rect.right || top + height > rect.top + rect.height
}

export function getFirstAvailableCoords({ item, gridSettings }: { item: BuildableFieldPreview['layout'], gridSettings: GridSettings }): {
  x: number;
  y: number;
} | null {

  for (let y = 0; y <= gridSettings.maxDimensions.rows - item.heightGridUnits; y++) {
    for (let x = 0; x <= gridSettings.maxDimensions.cols - item.widthGridUnits; x++) {
      const _item = { ...item, x, y };
      if (!hasCollisions(_item, Object.values(gridSettings.items))) {
        const newPosition = { x, y };
        return newPosition;
      }
    }
  }
  return null
}

export function getValidCoordsIfCollisionOrOutsideBounds({ item, gridSettings }: { item: BuildableFieldPreview['layout'], gridSettings: GridSettings }) {
  let existingCoords = { x: item.x, y: item.y }
  if (hasCollisions(item, Object.values(gridSettings.items)) || isOutsideBounds(calcPosition(item, { gap: gridSettings.gap, itemSize: gridSettings.itemSize }), gridSettings.boundsTo?.getBoundingClientRect())) {
    let newCoords = getFirstAvailableCoords({ item, gridSettings })
    return newCoords ?? existingCoords
  }
  return existingCoords
}
