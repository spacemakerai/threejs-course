import Grid, { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../Grid";

const MAX = 5;

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
          if (grid.getCellValue(_x, y, z)) break;
          east++;
        }
        for (let _x = x - 1; _x >= 0; _x--) {
          if (grid.getCellValue(_x, y, z)) break;
          west++;
        }
        for (let _y = y + 1; _y < GRID_DEPTH; _y++) {
          if (grid.getCellValue(x, _y, z)) break;
          north++;
        }
        for (let _y = y - 1; _y >= 0; _y--) {
          if (grid.getCellValue(x, _y, z)) break;
          south++;
        }
        const maxDistance = Math.max(east, west, north, south);
        scores.push(maxDistance);
      }
    }
  }

  return (
    scores.map((s) => Math.min(s, MAX) / MAX).reduce((a, b) => a + b, 0) /
    scores.length
  );
}
