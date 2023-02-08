import Grid from "../Grid";
import { getAnalysisScore, runAnalysis } from "../analysis";
import { GRID_CELL_COUNT } from "../constants";

function getNeighbour(grid: Grid) {
  const cloned = grid.clone();

  for (let i = 0; i < 5; i++) {
    if (Math.random() < 0.5) {
      const x = getRandomInt(0, GRID_CELL_COUNT.x);
      const y = getRandomInt(0, GRID_CELL_COUNT.y);
      const diff = getRandomInt(-1, 2);
      cloned.diff(x, y, diff);
    } else {
      const x0 = getRandomInt(0, GRID_CELL_COUNT.x);
      const y0 = getRandomInt(0, GRID_CELL_COUNT.y);

      const x1 = getRandomInt(0, GRID_CELL_COUNT.x);
      const y1 = getRandomInt(0, GRID_CELL_COUNT.y);

      const v0 = cloned.getCellValue(x0, y0);
      const v1 = cloned.getCellValue(x1, y1);
      cloned.setCellValue(x0, y0, v1);
      cloned.setCellValue(x1, y1, v0);
    }
  }

  return cloned;
}

export function* simulatedAnnealing(grid: Grid, MAX_ITER = 1_000, NO_PRINTS = 10) {
  let current = grid;
  let best = current;
  let bestScore = getAnalysisScore(current);

  let temp = 0.0003;
  const alpha = temp / MAX_ITER;

  for (let i = 0; i < MAX_ITER; i++) {
    temp -= alpha;
    const neigbour = getNeighbour(current);

    const oldScore = getAnalysisScore(current);
    const newScore = getAnalysisScore(neigbour);

    const cost = oldScore - newScore;

    const Paccept = Math.exp(-cost / temp);
    if (i % (MAX_ITER / NO_PRINTS) === 0) {
      console.log({ i, oldScore, newScore, temp, Paccept, cost, analysis: runAnalysis(current) });
      //getAnalysisScore(current, true);
      yield current;
    }
    if (cost < 0) {
      current = neigbour;
    } else if (Math.random() < Paccept) {
      current = neigbour;
    }
    if (newScore > bestScore) {
      best = current;
      bestScore = newScore;
    }

    if (i % 100 === 0) {
      yield current;
    }
  }

  return best;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
