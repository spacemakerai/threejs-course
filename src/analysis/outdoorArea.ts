import Grid, { GRID_DEPTH, GRID_WIDTH } from "../Grid";

export function getOutdoorAreaScore(grid: Grid) {
  const maxScore = GRID_WIDTH * GRID_DEPTH;
  const targetScore = maxScore / 3;

  let sum = 0;
  for (let x = 1; x < GRID_WIDTH - 1; x++) {
    for (let y = 1; y < GRID_DEPTH - 1; y++) {
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
  const maxScore = GRID_WIDTH * GRID_DEPTH;
  let sum = 0;
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_DEPTH; y++) {
      if (grid.getCellValue(x, y) === 0) {
        sum++;
      }
    }
  }
  return sum / maxScore;
}
