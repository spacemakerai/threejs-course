import Grid, { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../Grid";
import { getAnalysisScore } from "../analysis";

export class SimulatedAnnealing {
  grid: Grid;

  MAX_ITER = 1_000;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  getNeighbour() {
    const cloned = this.grid.clone();
    const x = getRandomInt(0, GRID_WIDTH);
    const y = getRandomInt(0, GRID_DEPTH);
    const z = getRandomInt(0, GRID_HEIGHT);

    const currentVal = cloned.getCellValue(x, y, z);
    if (!currentVal) {
      const below = z === 0 || cloned.getCellValue(x, y, z - 1);
      if (below) {
        cloned.setCellValue(x, y, z, true);
      }
    } else {
      if (!cloned.getCellValue(x, y, z + 1)) {
        cloned.setCellValue(x, y, z, false);
      }
    }

    return cloned;
  }

  run() {
    for (let i = 0; i < this.MAX_ITER; i++) {
      const neigbour = this.getNeighbour();

      const oldScore = getAnalysisScore(this.grid);
      const newScore = getAnalysisScore(neigbour);

      if (i % (this.MAX_ITER / 10) === 0) {
        console.log(i, oldScore);
      }

      const Paccept = Math.exp((-i / 1) * ((oldScore - newScore) / oldScore));

      if (Math.random() < Paccept) {
        this.grid = neigbour;
      }
    }
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
