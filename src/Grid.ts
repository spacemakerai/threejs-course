import { Vector2 } from "three";

export const CELL_WIDTH_DEPTH = 6;
export const CELL_HEIGHT = 3;

export const GRID_WIDTH = 20;
export const GRID_DEPTH = 20;
export const GRID_HEIGHT = 5;

export default class Grid {
  array: number[][] = [];
  static center = new Vector2((GRID_WIDTH * CELL_WIDTH_DEPTH) / 2, (GRID_DEPTH * CELL_WIDTH_DEPTH) / 2);

  constructor() {
    this.empty();
  }

  empty() {
    this.array = Array.from(Array(GRID_WIDTH)).map((_) => Array.from(Array(GRID_DEPTH)).map((_) => 0));
  }

  diff(x: number, y: number, diff: number) {
    const currentVal = this.array[x][y];
    let newVal = currentVal + diff;
    newVal = Math.min(newVal, GRID_HEIGHT);
    newVal = Math.max(newVal, 0);
    this.array[x][y] = newVal;
  }

  getCellValue(x: number, y: number): number {
    return this.array[x][y];
  }

  setCellValue(x: number, y: number, height: number): void {
    this.array[x][y] = height;
  }

  encode() {
    return btoa(JSON.stringify(this.array));
  }
  decode(encoded: string) {
    this.array = JSON.parse(atob(encoded));
  }

  clone() {
    const cloned = new Grid();
    cloned.array = JSON.parse(JSON.stringify(this.array));
    return cloned;
  }
}
