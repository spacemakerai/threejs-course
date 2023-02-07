import Grid, { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../Grid";
import { getAnalysisScore } from "../analysis";

function getNeighbour(grid: Grid) {
  const cloned = grid.clone();

  if (Math.random() < 0.5) {
    const x = getRandomInt(0, GRID_WIDTH);
    const y = getRandomInt(0, GRID_DEPTH);
    const diff = getRandomInt(-2, 2);
    cloned.diff(x, y, diff);
  } else {
    const x0 = getRandomInt(0, GRID_WIDTH);
    const y0 = getRandomInt(0, GRID_DEPTH);

    const x1 = getRandomInt(0, GRID_WIDTH);
    const y1 = getRandomInt(0, GRID_DEPTH);

    const v0 = cloned.getCellValue(x0, y0);
    const v1 = cloned.getCellValue(x1, y1);
    cloned.setCellValue(x0, x0, v1);
    cloned.setCellValue(x1, x1, v0);
  }

  return cloned;
}

export function* simulatedAnnealing(grid: Grid, MAX_ITER: number = 1_000, NO_PRINTS: number = 10) {
  let current: Grid = grid;
  let best = current;
  let bestScore = getAnalysisScore(current);

  for (let i = 0; i < MAX_ITER; i++) {
    const neigbour = getNeighbour(current);

    const oldScore = getAnalysisScore(current);
    const newScore = getAnalysisScore(neigbour);

    if (i % (MAX_ITER / NO_PRINTS) === 0) {
      console.log(i, oldScore);
      //getAnalysisScore(current, true);
      yield current;
    }

    const Paccept = Math.exp((-i / 1) * ((oldScore - newScore) / oldScore));

    if (Math.random() < Paccept) {
      current = neigbour;
    }
    if (newScore > bestScore) {
      best = current;
      bestScore = newScore;
    }
  }

  return best;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
