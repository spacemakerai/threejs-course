import { Vector2, Vector3 } from "three";

export const CELL_SIZE = new Vector3(6, 6, 3);
export const GRID_CELL_COUNT = new Vector3(20, 20, 10);
export const GRID_SIZE = new Vector3().multiplyVectors(CELL_SIZE, GRID_CELL_COUNT);

export const GRID_CENTER = new Vector2(GRID_SIZE.x / 2, GRID_SIZE.y / 2);

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
