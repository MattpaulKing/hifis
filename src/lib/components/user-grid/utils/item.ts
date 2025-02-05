import type { LayoutItem, ItemPosition, ItemSize, Position, Size } from '../types';
import type { GridSettings } from './GridContext.svelte';
export type SnapGridParams = Required<Pick<GridSettings, 'itemSize' | 'gap' | 'maxDimensions'>>

export function coordinate2position(coordinate: number, cellSize: number, gap: number): number {
  return coordinate * cellSize + (coordinate) * gap;
}

export function coordinate2size(coordinate: number, cellSize: number, gap: number): number {
  return coordinate * cellSize + (coordinate - 1) * gap;
}

export function position2coordinate(position: number, cellSize: number, gap: number): number {
  return Math.round(position / (cellSize + gap));
}

export function size2coordinate(size: number, cellSize: number, gap: number): number {
  return position2coordinate(size + gap * 2, cellSize, gap);
}

export function snapOnMove(left: number, top: number, item: LayoutItem, { itemSize, gap, maxDimensions }: SnapGridParams): Position {
  const { widthGridUnits, heightGridUnits } = item;
  let x = position2coordinate(left, itemSize.width, gap);
  let y = position2coordinate(top, itemSize.height, gap);
  x = clamp(x, 0, maxDimensions.cols - widthGridUnits);
  y = clamp(y, 0, maxDimensions.rows - heightGridUnits);
  return { x, y };
}

export function snapOnResize(w: number, h: number, item: LayoutItem, { itemSize, gap, maxDimensions }: SnapGridParams): Size {
  const { x, y } = item;
  let widthGridUnits = position2coordinate(w + gap * 2, itemSize.width, gap);
  let heightGridUnits = position2coordinate(h + gap * 2, itemSize.height, gap);
  widthGridUnits = clamp(widthGridUnits, 0, maxDimensions.cols - x);
  heightGridUnits = clamp(heightGridUnits, 0, maxDimensions.rows - y);
  return { widthGridUnits, heightGridUnits };
}
export function calcPosition(item: LayoutItem, options: {
  itemSize: ItemSize;
  gap: number;
}): ItemPosition & ItemSize {
  const { itemSize, gap } = options;
  return {
    left: coordinate2position(item.x, itemSize.width, gap),
    top: coordinate2position(item.y, itemSize.height, gap),
    width: coordinate2size(item.widthGridUnits, itemSize.width, gap),
    height: coordinate2size(item.heightGridUnits, itemSize.height, gap)
  };
}

export function clamp(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}
