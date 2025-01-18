import { getAvailablePosition, hasCollisions } from './utils/grid';
import type { GridParams, GridController as GridControllerType } from './types';

export class GridController implements GridControllerType {
  gridParams: GridParams;
  constructor(gridParams: GridParams) {
    this.gridParams = gridParams;
  }
  getFirstAvailablePosition(w: number, h: number): {
    x: number;
    y: number;
  } | null {
    const { items, maxCols, maxRows } = this.gridParams;
    return getAvailablePosition({
      id: '',
      x: 0,
      y: 0,
      w,
      h,
      moveable: true,
      resizable: true,
      invalidate: () => {
        /* .. */
      }
    }, Object.values(items), maxCols, maxRows);
  }
  compress() {
    this._compress(this.gridParams.items);
  }
  _internalCompress() {
    this._compress(this.gridParams.items);
  }
  _compress(items: GridParams["items"]) {
    const gridItems = Object.values(items);
    const sortedItems = [...gridItems].sort((a, b) => a.y - b.y);
    sortedItems.reduce((accItem, currentItem) => {
      let newY = currentItem.y;
      while (newY >= 0) {
        if (hasCollisions({ ...currentItem, y: newY }, accItem)) {
          break;
        }
        newY--;
      }
      if (newY !== currentItem.y - 1) {
        currentItem.y = newY + 1;
        currentItem.invalidate();
      }
      accItem.push(currentItem);
      return accItem;
    }, [] as GridParams["items"][keyof GridParams['items']][]);
  }
}
