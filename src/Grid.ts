import { Vector2 } from "three";

export const CELL_WIDTH_DEPTH = 6;
export const CELL_HEIGHT = 3;

export const GRID_WIDTH = 30;
export const GRID_DEPTH = 30;
export const GRID_HEIGHT = 5;

export default class Grid {
  array: boolean[] = [];
  static center = new Vector2((GRID_WIDTH * CELL_WIDTH_DEPTH) / 2, (GRID_DEPTH * CELL_WIDTH_DEPTH) / 2);

  constructor() {
    this.empty();
  }

  empty() {
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_DEPTH; y++) {
        for (let z = 0; z < GRID_HEIGHT; z++) {
          this.setCellValue(x, y, z, false);
          // this.array[this.getIndex(x, y, z)] =
          //   Math.random() < 1 - z / GRID_HEIGHT;
        }
      }
    }
  }

  getIndex(x: number, y: number, z: number): number {
    return x * GRID_DEPTH * GRID_HEIGHT + y * GRID_HEIGHT + z;
  }

  getCellValue(x: number, y: number, z: number): boolean {
    return this.array[this.getIndex(x, y, z)];
  }

  setCellValue(x: number, y: number, z: number, value: boolean): void {
    this.array[this.getIndex(x, y, z)] = value;
  }

  encode() {
    const positions: [number, number, number][] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_DEPTH; y++) {
        for (let z = 0; z < GRID_HEIGHT; z++) {
          if (this.getCellValue(x, y, z)) {
            positions.push([x, y, z]);
          }
        }
      }
    }
    return btoa(JSON.stringify(positions));
  }
  decode(encoded: string) {
    this.empty();
    const positions = JSON.parse(atob(encoded)) as [number, number, number][];
    for (let [x, y, z] of positions) {
      this.setCellValue(x, y, z, true);
    }
  }

  clone() {
    const cloned = new Grid();
    cloned.array = [...this.array];
    return cloned;
  }
}
