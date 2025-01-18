import { getContext, setContext } from "svelte";
import type { GridDimensions, GridParams, ItemSize, LayoutItem } from "../types";

type GridSettingsParams = {
  cols: number,
  rows: number,
  maxCols?: number,
  maxRows?: number,
  gap?: number,
  items?: Record<string, LayoutItem>,
  itemSize: ItemSize,
  bounds?: boolean,
  readOnly?: boolean,
  debug?: boolean,
  collision?: "none"
}

class GridSettings {
  cols = $state(0)
  rows = $state(0)
  maxCols = $state(Infinity)
  maxRows = $state(Infinity)
  gap = $state(0)
  items = $state<Record<string, LayoutItem>>({})
  itemSize = $state<ItemSize>()
  bounds = $state(false)
  boundsTo = $state<HTMLDivElement | undefined>()
  readOnly = $state(false)
  debug = $state(false)
  collision = $state<"compress" | "push" | "none">("none")
  containerWidth: number | null = $state(null);
  containerHeight: number | null = $state(null);

  constructor(params: GridSettingsParams) {
    this.cols = params.cols
    this.rows = params.rows
    this.maxCols = params.maxCols ?? this.maxCols
    this.maxRows = params.maxRows ?? this.maxRows
    this.gap = params.gap ?? this.gap
    this.items = params.items ?? this.items
    this.itemSize = params.itemSize
    this.bounds = params.bounds ?? false
    this.readOnly = params.readOnly ?? false
    this.debug = params.debug ?? false
    this.collision = params.collision ?? "none"
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
  getGridDimensions(items: LayoutItem[]): GridDimensions {
    let cols = 0;
    let rows = 0;
    items.forEach((item) => {
      cols = Math.max(cols, item.x + item.w);
      rows = Math.max(rows, item.y + item.h);
    });
    return { cols, rows };
  }
}

const GRID_CONTEXT_NAME = Symbol('svelte-grid-extended-context');
export function getGridContext() {
  let context = getContext<GridSettings>(GRID_CONTEXT_NAME);
  if (context === undefined) {
    throw new Error(
      `<GridItem /> is missing a parent <Grid /> component. Make sure you are using the component inside a <Grid />.`
    );
  }
  return context;
}
export function setGridContext(gridSettings: GridSettingsParams) {
  return setContext(GRID_CONTEXT_NAME, new GridSettings(gridSettings));
}
