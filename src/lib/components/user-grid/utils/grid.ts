import type { GridDimensions, LayoutItem } from '../types';
export function isItemColliding(item: LayoutItem, otherItem: LayoutItem): boolean {
  return (item.id !== otherItem.id &&
    item.x <= otherItem.x + otherItem.width - 1 &&
    item.y <= otherItem.y + otherItem.height - 1 &&
    item.x + item.width - 1 >= otherItem.x &&
    item.y + item.height - 1 >= otherItem.y);
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
    cols = Math.max(cols, item.x + item.width);
    rows = Math.max(rows, item.y + item.height);
  });
  return { cols, rows };
}
export function getAvailablePosition(currentItem: LayoutItem, items: LayoutItem[], maxCols: number, maxRows: number): {
  x: number;
  y: number;
} | null {
  for (let y = 0; y <= maxRows - currentItem.height; y++) {
    for (let x = 0; x <= maxCols - currentItem.width; x++) {
      const item = { ...currentItem, x, y };
      if (!hasCollisions(item, items)) {
        const newPosition = { x, y };
        return newPosition;
      }
    }
  }
  return null;
}
