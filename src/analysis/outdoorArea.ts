import Grid, { GRID_CELL_COUNT } from "../Grid";

export function getOutdoorAreaScore(grid: Grid) {
  const maxScore = GRID_CELL_COUNT.x * GRID_CELL_COUNT.y;
  const targetScore = maxScore / 3;

  let sum = 0;
  for (let x = 1; x < GRID_CELL_COUNT.x - 1; x++) {
    for (let y = 1; y < GRID_CELL_COUNT.y - 1; y++) {
      const cells = [
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y],
        [x, y],
        [x + 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
      ];
      if (!cells.some(([x, y]) => grid.getCellValue(x, y) > 0)) {
        sum++;
      }
    }
  }
  return Math.min(sum, targetScore) / targetScore;
}

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
