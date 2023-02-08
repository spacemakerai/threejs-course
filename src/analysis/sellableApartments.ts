import Grid, { GRID_CELL_COUNT } from "../Grid";

const RATIO = 4;
const DENSITY_TARGET = (GRID_CELL_COUNT.x * GRID_CELL_COUNT.y * GRID_CELL_COUNT.z) / RATIO;

export function calculateApartmentCount(grid: Grid): number {
  const count = grid.array.reduce((sum, _grid) => {
    return sum + _grid.reduce((a, b) => a + b);
  }, 0);

  return Math.min(count, DENSITY_TARGET) / DENSITY_TARGET;
}
