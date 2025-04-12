import type { GridDimensions, LayoutItem } from '../types';
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
