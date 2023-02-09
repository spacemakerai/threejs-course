import Grid from "../Grid";
import { GRID_CELL_COUNT } from "../constants";

const MAX = 8;

export function generateViewScoresPerApartment(grid: Grid) {
  const scores: number[][][] = grid.array.map((row) => row.map((column) => [...Array(column)]));
  for (let x = 0; x < GRID_CELL_COUNT.x; x++) {
    for (let y = 0; y < GRID_CELL_COUNT.y; y++) {
      let east = 0;
      let west = 0;
      let north = 0;
      let south = 0;

      const cellValue = grid.getCellValue(x, y);
      if (cellValue === 0) continue;

      for (let z = 1; z <= cellValue; z++) {
        for (let _x = x + 1; _x < GRID_CELL_COUNT.x; _x++) {
          if (_x === GRID_CELL_COUNT.x - 1) {
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
        for (let _y = y + 1; _y < GRID_CELL_COUNT.y; _y++) {
          if (_y === GRID_CELL_COUNT.y - 1) {
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

        if (maxDistance === 0) {
          scores[x][y][z - 1] = -10;
        } else {
          scores[x][y][z - 1] = Math.min(1 - (MAX - maxDistance) / MAX, 1);
        }
      }
    }
  }

  return scores;
}

export function calculateViewDistance(grid: Grid): number {
  const scores = generateViewScoresPerApartment(grid);

  if (scores.length === 0) return 0;

  //return scores.reduce((prev, curr) => Math.min(prev, curr), scores[0]);
  if (scores.flat().flat().length === 0) return 0;
  return (
    scores
      .flat()
      .flat()
      .reduce((a, b) => a + b, 0) / scores.flat().flat().length
  );
}
