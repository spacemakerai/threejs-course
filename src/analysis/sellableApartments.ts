import Grid, { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../Grid";

export function calculateApartmentCount(grid: Grid): number {
  const count = grid.array.reduce((sum, value) => {
    return sum + (value ? 1 : 0);
  }, 0);

  return count / (GRID_WIDTH * GRID_DEPTH * GRID_HEIGHT);
}
