import { getContext, setContext } from "svelte";
import type { GridDimensions, ItemSize, LayoutItem } from "../types";
import { getAvailablePosition } from "./grid";

type GridSettingsParams = {
  cols: number,
  rows: number,
  gap?: number,
  items?: Record<string, LayoutItem>,
  itemSize: ItemSize,
  bounds?: boolean,
  readOnly?: boolean,
  debug?: boolean,
}

export class GridSettings {
  cols = $state<number>(0)
  rows = $state(0)
  gap = $state(0)
  items = $state<Record<string, LayoutItem>>({})
  itemSize = $state<ItemSize>({ width: 0, height: 0 })
  bounds = $state(false)
  boundsTo = $state<HTMLDivElement | undefined>()
  readOnly = $state(false)
  debug = $state(false)
  maxDimensions = $derived.by(() => {
    let rect = this.boundsTo?.getBoundingClientRect()
    if (!rect) return { cols: this.cols, rows: this.rows }
    return {
      cols: Math.round(rect.width / this.itemSize.width),
      rows: Math.round(rect.height / this.itemSize.height),
    }
  })
  constructor(params: GridSettingsParams) {
    this.cols = params.cols
    this.rows = params.rows
    this.gap = params.gap ?? this.gap
    this.items = params.items ?? this.items
    this.itemSize = params.itemSize
    this.bounds = params.bounds ?? false
    this.readOnly = params.readOnly ?? false
    this.debug = params.debug ?? false
  }
  registerItem(item: LayoutItem) {
    if (item.id in this.items) {
      throw new Error(`Item with id ${item.id} already exists`);
    }
    this.items[item.id] = item;
  }
  unregisterItem(item: LayoutItem) {
    delete this.items[item.id];
  }
  getGridDimensions(): GridDimensions {
    let cols = 0;
    let rows = 0;
    Object.values(this.items).forEach((item) => {
      cols = Math.max(cols, item.x + item.w);
      rows = Math.max(rows, item.y + item.h);
    });
    return { cols, rows };
  }
  getFirstAvailablePosition(w: number, h: number): {
    x: number;
    y: number;
  } | null {
    let rect = this.boundsTo?.getBoundingClientRect()
    console.log('rect', rect)
    if (!rect) return null
    let maxCols = Math.round(rect.width / (this.itemSize.width + this.gap)) - 1
    let maxRows = Math.round(rect.height / (this.itemSize.height + this.gap)) - 1
    return getAvailablePosition({
      id: '',
      x: 0,
      y: 0,
      w,
      h,
      min: { w: 32, h: 32 },
      moveable: true,
      resizeable: true,
    }, Object.values(this.items), maxCols, maxRows);
  }
}

const GRID_CTX = Symbol('GRID_CTX');
export function getGridContext() {
  let context = getContext<GridSettings>(GRID_CTX);
  if (context === undefined) {
    throw new Error(
      `<GridItem /> is missing a parent <Grid /> component. Make sure you are using the component inside a <Grid />.`
    );
  }
  return context;
}
export function setGridContext(gridSettings: GridSettingsParams) {
  return setContext(GRID_CTX, new GridSettings(gridSettings));
}
