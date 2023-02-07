import Grid from "../Grid";
import { getOutdoorAreaScore, getOutdoorAreaSimple } from "./outdoorArea";
import { calculateViewDistance } from "./viewDistance";
import { calculateApartmentCount } from "./sellableApartments";

export function getAnalysisScore(grid: Grid, print: boolean = false): number {
  const scores = {
    outdoor1: getOutdoorAreaScore(grid),
    outdoor2: getOutdoorAreaSimple(grid),
    view: calculateViewDistance(grid),
    sellableApartments: calculateApartmentCount(grid),
  };
  if (print) {
    console.log(scores);
  }

  const score = [scores.outdoor1 / 2, scores.view, scores.sellableApartments];
  return score.reduce((a, b) => a + b, 0) / score.length;
}
