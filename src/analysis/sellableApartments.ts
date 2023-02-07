import Grid, { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../Grid";

const RATIO = 3;
const MAX_POSSIBLE = GRID_WIDTH * GRID_DEPTH * GRID_HEIGHT;
const DENSITY_TARGET = (GRID_WIDTH * GRID_DEPTH * GRID_HEIGHT) / RATIO;

export function calculateApartmentCount(grid: Grid): number {
  const count = grid.array.reduce((sum, _grid) => {
    return sum + _grid.reduce((a, b) => a + b);
  }, 0);

  return (RATIO * Math.min(count, DENSITY_TARGET)) / MAX_POSSIBLE;
}
