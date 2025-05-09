export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];
export type LayoutItem = Size & Position & {
  id: string;
  min: Size;
  max?: Size;
  moveable: boolean;
  resizeable: boolean;
};

/**
 * Item position in grid units
 */
export type Size = {
  widthGridUnits: number;
  heightGridUnits: number;
};
/**
 * Item position in grid units
 */
export type Position = {
  x: number;
  y: number;
};
/**
 * Item position in pixels
 */
export type ItemPosition = {
  left: number;
  top: number;
};
/**
 * Item size in pixels
 */
export type ItemSize = {
  width: number;
  height: number;
};
export type ItemChangeEvent = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
};
export type BreakpointKey = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type Breakpoints = Record<BreakpointKey, number>;
export type GridSize = number | RequireAtLeastOne<Breakpoints>;
export type GridDimensions = {
  cols: number;
  rows: number;
};
export type GridParams = {
  cols: number;
  rows: number;
  itemSize?: ItemSize;
  gap: number;
  maxCols: number;
  maxRows: number;
  bounds: boolean;
  boundsTo?: HTMLElement;
  items: Record<string, LayoutItem>;
  readOnly: boolean;
  debug: boolean;
  collision: Collision;
  registerItem: (item: LayoutItem) => void;
  unregisterItem: (item: LayoutItem) => void;
};
export type LayoutChangeDetail = {
  item: LayoutItem;
};
export type Collision = 'none' | 'push' | 'compress';
export type GridController = {
  gridParams: GridParams;
  getFirstAvailablePosition: (w: number, h: number) => Position | null;
  compress: () => void;
};
export type GridOptions = {
  cols: GridSize;
  rows: GridSize;
  itemSize: Partial<ItemSize>;
}
