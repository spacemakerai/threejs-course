import Grid, { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../Grid";

const MAX_POSSIBLE = GRID_WIDTH * GRID_DEPTH * GRID_HEIGHT;
const DENSITY_TARGET = (GRID_WIDTH * GRID_DEPTH * GRID_HEIGHT) / 4;

export function calculateApartmentCount(grid: Grid): number {
  const count = grid.array.reduce((sum, _grid) => {
    return sum + _grid.reduce((a, b) => a + b);
  }, 0);

  return Math.min(count, DENSITY_TARGET) / MAX_POSSIBLE;
}
