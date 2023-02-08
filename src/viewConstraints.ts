import Grid from "./Grid";
import { CELL_SIZE, GRID_CELL_COUNT, GRID_SIZE } from "./constants";

export function viewConstraints(grid: Grid) {
  const appCanvas = document.getElementById("app") as HTMLCanvasElement;
  appCanvas.hidden = !appCanvas.hidden;
  const canvas = document.getElementById("export") as HTMLCanvasElement;
  canvas.hidden = !canvas.hidden;
  exportToImage(canvas, grid);
}

export function exportToImage(canvas: HTMLCanvasElement, grid: Grid): void {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const widthRatio = canvas.width / GRID_SIZE.x;
  const heightRatio = canvas.height / GRID_SIZE.y;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.fillStyle = "#aaaaaa";
  context.fillRect(0, 0, canvas.width, canvas.height);
  grid.array.forEach((row, x) =>
    row.forEach((floors, y) => {
      if (floors > 0) {
        const _x = x * CELL_SIZE.x * widthRatio;
        const _y = (GRID_CELL_COUNT.y - y) * CELL_SIZE.y * heightRatio;
        context.fillStyle = `hsl(${(floors / GRID_CELL_COUNT.z) * 360}, 100%, 50%)`;
        context.fillRect(_x, _y, CELL_SIZE.x * widthRatio, CELL_SIZE.y * heightRatio);
        context.strokeRect(_x, _y, CELL_SIZE.x * widthRatio, CELL_SIZE.y * heightRatio);
        context.fillStyle = "#000000";
        context.font = "20px Inter, Avenir, Helvetica, Arial, sans-serif";
        context.textAlign = "center";
        context.fillText(floors.toString(), _x + 0.5 * CELL_SIZE.x * widthRatio, _y + 0.5 * CELL_SIZE.y * heightRatio + 5);
      }
    })
  );
}
