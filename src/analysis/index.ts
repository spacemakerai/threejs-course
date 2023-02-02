import Grid from "../Grid";
import { getOutdoorAreaScore, getOutdoorAreaSimple } from "./outdoorArea";
import { calculateViewDistance } from "./viewDistance";

export function getAnalysisScore(grid: Grid): void {
  console.log({
    outdoor1: getOutdoorAreaScore(grid),
    outdoor2: getOutdoorAreaSimple(grid),
    view: calculateViewDistance(grid),
  });
}
