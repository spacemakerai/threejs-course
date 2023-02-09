import Grid from "../Grid";
import { GRID_CELL_COUNT } from "../constants";

export function getOutdoorAreaSimple(grid: Grid) {
  const maxScore = GRID_CELL_COUNT.x * GRID_CELL_COUNT.y;
  let sum = 0;
  for (let x = 0; x < GRID_CELL_COUNT.x; x++) {
    for (let y = 0; y < GRID_CELL_COUNT.y; y++) {
      if (grid.getCellValue(x, y) === 0) {
        sum++;
      }
    }
  }
  return sum / maxScore;
}
