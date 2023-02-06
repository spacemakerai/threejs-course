import Grid from "../Grid";

export function calculateApartmentCount(grid: Grid) {
  return grid.array.reduce((sum, value) => {
    return sum + (value ? 1 : 0);
  }, 0);
}
