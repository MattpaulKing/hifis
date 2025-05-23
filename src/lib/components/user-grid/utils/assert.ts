import type { GridOptions } from "../types";

export function assertGridOptions({ cols, rows, itemSize }: GridOptions) {
  if ((cols === 0 && itemSize?.width === undefined) ||
    (typeof cols === 'object' && Object.values(cols).includes(0) && itemSize?.width === undefined)) {
    return new Error('If `cols` === `0`, the `itemSize.width` parameter must be specified');
  }
  if ((rows === 0 && itemSize?.height === undefined) ||
    (typeof rows === 'object' && Object.values(rows).includes(0) && itemSize?.height === undefined)) {
    return new Error('If `rows` === `0`, the `itemSize.height` parameter must be specified');
  }
  if (typeof cols === 'number' && cols < 0) {
    return new Error('`cols` must be greater than or equal to `0`');
  }
  if (typeof rows === 'number' && rows < 0) {
    return new Error('`rows` must be greater than or equal to `0`');
  }
}
