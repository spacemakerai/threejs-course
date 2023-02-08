import Grid, { GRID_DEPTH, GRID_WIDTH } from "../Grid";
import { constraintGrid } from "../constraint";

// Color all blocks according to legality
export function constraintAnalysis(grid: Grid): number {
  let count = 0;

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_DEPTH; y++) {
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
