import Grid from "./Grid";

export const constraintGrid = new Grid();

type Area = { x0: number; x1: number; y0: number; y1: number; height: number };

const areas: Area[] = [
  { x0: 3, x1: 10, y0: 2, y1: 4, height: 3 },
  { x0: 3, x1: 10, y0: 4, y1: 8, height: 6 },
  { x0: 12, x1: 14, y0: 2, y1: 8, height: 2 },
  { x0: 6, x1: 14, y0: 8, y1: 18, height: 4 },
  { x0: 14, x1: 18, y0: 6, y1: 18, height: 3 },
];

for (let area of areas) {
  for (let x = area.x0; x < area.x1; x++) {
    for (let y = area.y0; y < area.y1; y++) {
      constraintGrid.setCellValue(x, y, area.height);
    }
  }
}
