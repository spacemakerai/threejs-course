import Grid from "../Grid";
import { constraintGrid } from "../constraint";
import { GRID_CELL_COUNT } from "../constants";

// Count all blocks according to legality
export function constraintAnalysis(grid: Grid): number {
  let count = 0;

  for (let x = 0; x < GRID_CELL_COUNT.x; x++) {
    for (let y = 0; y < GRID_CELL_COUNT.y; y++) {
      const height = grid.getCellValue(x, y);
      const maxHeight = constraintGrid.getCellValue(x, y);
      const diff = height - maxHeight;
      if (diff > 0) {
        count += diff;
      }
    }
  }

  return count * -0.04;
}
