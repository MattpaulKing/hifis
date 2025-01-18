import type { Breakpoints, GridSize } from "../types";

export function findGridSize(cols: GridSize, width: number, breakpoints: Breakpoints) {
  if (typeof cols == 'number') {
    return cols;
  }
  return Object.entries(cols).reduce((acc, obj) => Math.abs(width - breakpoints[obj[0] as keyof Breakpoints]) <
    Math.abs(width - breakpoints[acc[0] as keyof Breakpoints])
    ? obj
    : acc)[1];
}
