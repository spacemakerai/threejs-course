import Grid, { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../Grid";

const MAX = 10;

export function calculateViewDistance(grid: Grid): number {
  let scores = [];
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_DEPTH; y++) {
      for (let z = 0; z < GRID_HEIGHT; z++) {
        let east = 0;
        let west = 0;
        let north = 0;
        let south = 0;

        const cellValue = grid.getCellValue(x, y, z);
        if (!cellValue) continue;

        for (let _x = x + 1; _x < GRID_WIDTH; _x++) {
          if (_x === GRID_WIDTH - 1) {
            east = MAX;
            break;
          }
          if (grid.getCellValue(_x, y, z)) break;
          east++;
        }
        for (let _x = x - 1; _x >= 0; _x--) {
          if (_x === 0) {
            west = MAX;
            break;
          }
          if (grid.getCellValue(_x, y, z)) break;
          west++;
        }
        for (let _y = y + 1; _y < GRID_DEPTH; _y++) {
          if (_y === GRID_DEPTH - 1) {
            north = MAX;
            break;
          }
          if (grid.getCellValue(x, _y, z)) break;
          north++;
        }
        for (let _y = y - 1; _y >= 0; _y--) {
          if (_y === 0) {
            south = MAX;
            break;
          }
          if (grid.getCellValue(x, _y, z)) break;
          south++;
        }
        const maxDistance = Math.max(east, west, north, south);

        if (maxDistance === 0) {
          scores.push(-10);
        } else {
          scores.push(-1 / maxDistance ** 2 + 1);
        }

        // if (maxDistance === 0) {
        //   scores.push(-10);
        // } else {
        //   scores.push(maxDistance);
        // }
      }
    }
  }

  if (scores.length === 0) return 0;

  return scores.map((s) => Math.min(s, MAX) / MAX).reduce((a, b) => a + b, 0) / scores.length;
}
