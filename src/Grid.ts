export const CELL_WIDTH_DEPTH = 6;
export const CELL_HEIGHT = 3;

export const GRID_WIDTH = 10;
export const GRID_DEPTH = 10;
export const GRID_HEIGHT = 5;

export default class Grid {
  array: boolean[] = [];

  constructor() {
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_DEPTH; y++) {
        for (let z = 0; z < GRID_HEIGHT; z++) {
          this.array[this.getIndex(x, y, z)] = false;
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
}
