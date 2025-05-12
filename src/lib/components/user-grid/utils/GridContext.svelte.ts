import { getContext, setContext } from "svelte";
import { MediaQuery } from "svelte/reactivity";
import type { GridDimensions, ItemSize, LayoutItem } from "../types";
import type { BuildableField } from "../../forms";

type GridSettingsParams = {
  cellSize: number,
  cols?: number,
  rows?: number,
  items?: Record<string, BuildableField['layout']>,
  bounds?: boolean,
  boundsTo?: HTMLDivElement,
  readOnly?: boolean,
  debug?: boolean,
}

export class GridSettings {
  cols = $state<number>(0)
  rows = $state(0)
  gap = $state(0)
  items = $state<Record<string, BuildableField['layout']>>({})
  itemSize = $state<ItemSize>({ width: 0, height: 0 })
  bounds = $state(false)
  boundsTo = $state<HTMLDivElement | undefined>()
  readOnly = $state(false)
  debug = $state(false)
  maxDimensions = $state({ cols: this.cols, rows: this.rows })

  screenView: "xl" | "lg" | "sm" = $state(
    new MediaQuery('min-width: 1080px', true).current
      ? 'xl'
      : new MediaQuery('min-width: 1024px')
        ? 'lg'
        : 'sm'
  );
  constructor(params: GridSettingsParams) {
    this.cols = params.cols ?? this.cols
    this.rows = params.rows ?? this.rows
    this.gap = params.cellSize ?? this.gap
    this.items = params.items ?? this.items
    this.itemSize = { height: params.cellSize, width: params.cellSize }
    this.bounds = params.bounds ?? false
    this.boundsTo = params.boundsTo ?? undefined
    this.readOnly = params.readOnly ?? false
    this.debug = params.debug ?? false
  }
  registerItem(item: BuildableField['layout']) {
    if (item.id in this.items) {
      delete this.items[item.id]
    }
    this.items[item.id] = item;
  }
  unregisterItem(item: LayoutItem) {
    if (item.id in this.items) {
      delete this.items[item.id];
    }
  }
  getGridDimensions(): GridDimensions {
    let cols = 0;
    let rows = 0;
    Object.values(this.items).forEach((item) => {
      cols = Math.max(cols, item.x + item.widthGridUnits);
      rows = Math.max(rows, item.y + item.heightGridUnits);
    });
    return { cols, rows };
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
