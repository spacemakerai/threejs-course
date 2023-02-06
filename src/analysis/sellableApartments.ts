import Grid, { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../Grid";

export function calculateApartmentCount(grid: Grid): number {
  const count = grid.array.reduce((sum, _grid) => {
    return sum + _grid.reduce((a, b) => a + b);
  }, 0);

  return count / (GRID_WIDTH * GRID_DEPTH * GRID_HEIGHT);
}
