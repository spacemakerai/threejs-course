import Grid, { GRID_DEPTH, GRID_WIDTH } from "../Grid";

const MAX = 6;

export function calculateViewDistance(grid: Grid, print: boolean = false): number {
  let scores = [];
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_DEPTH; y++) {
      let east = 0;
      let west = 0;
      let north = 0;
      let south = 0;

      const cellValue = grid.getCellValue(x, y);
      if (cellValue === 0) continue;

      for (let z = 1; z <= cellValue; z++) {
        for (let _x = x + 1; _x < GRID_WIDTH; _x++) {
          if (_x === GRID_WIDTH - 1) {
            east = MAX;
            break;
          }
          if (grid.getCellValue(_x, y) >= z) break;
          east++;
        }
        for (let _x = x - 1; _x >= 0; _x--) {
          if (_x === 0) {
            west = MAX;
            break;
          }
          if (grid.getCellValue(_x, y) >= z) break;
          west++;
        }
        for (let _y = y + 1; _y < GRID_DEPTH; _y++) {
          if (_y === GRID_DEPTH - 1) {
            north = MAX;
            break;
          }
          if (grid.getCellValue(x, _y) >= z) break;
          north++;
        }
        for (let _y = y - 1; _y >= 0; _y--) {
          if (_y === 0) {
            south = MAX;
            break;
          }
          if (grid.getCellValue(x, _y) >= z) break;
          south++;
        }
        const maxDistance = Math.max(east, west, north, south);

        if (print) {
          console.log(maxDistance);
        }
        if (maxDistance === 0) {
          scores.push(-10);
        } else {
          scores.push(Math.min(1 - (MAX - maxDistance) / MAX, 1));
        }
      }

      // if (maxDistance === 0) {
      //   scores.push(-10);
      // } else {
      //   scores.push(maxDistance);
      // }
    }
  }

  if (print) {
    console.log(scores);
  }

  if (scores.length === 0) return 0;

  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
