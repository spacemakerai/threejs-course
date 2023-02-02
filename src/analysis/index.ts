import Grid from "../Grid";
import { getOutdoorAreaScore, getOutdoorAreaSimple } from "./outdoorArea";

export function getAnalysisScore(grid: Grid): number {
  const scores = [getOutdoorAreaScore(grid), getOutdoorAreaSimple(grid)];

  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return average;
}
