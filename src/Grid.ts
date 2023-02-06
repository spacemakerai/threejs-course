export const CELL_WIDTH_DEPTH = 6;
export const CELL_HEIGHT = 3;

export const GRID_WIDTH = 30;
export const GRID_DEPTH = 30;
export const GRID_HEIGHT = 5;

export default class Grid {
  array: number[][] = [];

  constructor() {
    this.empty();
  }

  empty() {
    this.array = Array.from(Array(GRID_WIDTH)).map((_) => Array.from(Array(GRID_DEPTH)).map((_) => 0));
  }

  addOne(x: number, y: number) {
    const currentVal = this.array[x][y];
    let newVal = currentVal + 1;
    newVal = Math.min(newVal, GRID_HEIGHT);
    newVal = Math.max(newVal, 0);
    this.array[x][y] = newVal;
  }

  subtractOne(x: number, y: number) {
    const currentVal = this.array[x][y];
    let newVal = currentVal - 1;
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
