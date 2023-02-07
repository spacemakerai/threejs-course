import Grid, { GRID_DEPTH, GRID_WIDTH } from "../Grid";
import { getAnalysisScore } from "../analysis";

export class SimulatedAnnealing {
  grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  getNeighbour() {
    const cloned = this.grid.clone();
    const x = getRandomInt(0, GRID_WIDTH);
    const y = getRandomInt(0, GRID_DEPTH);

    const diff = getRandomInt(-2, 2);
    cloned.diff(x, y, diff);
    return cloned;
  }

  run(MAX_ITER: number = 1_000) {
    for (let i = 0; i < MAX_ITER; i++) {
      const neigbour = this.getNeighbour();

      const oldScore = getAnalysisScore(this.grid);
      const newScore = getAnalysisScore(neigbour);

      if (i % (MAX_ITER / 10) === 0) {
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
