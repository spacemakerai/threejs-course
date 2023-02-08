import { GRID_CELL_COUNT } from "./constants";

/** The size of the grid is defined in the file "constants.ts" */

export default class Grid {
  array: number[][] = [];

  constructor() {
    this.empty();
  }

  empty() {
    this.array = Array.from(Array(GRID_CELL_COUNT.x)).map((_) => Array.from(Array(GRID_CELL_COUNT.y)).map((_) => 0));
  }

  diff(x: number, y: number, diff: number) {
    const currentVal = this.array[x][y];
    let newVal = currentVal + diff;
    newVal = Math.min(newVal, GRID_CELL_COUNT.z);
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
