import Grid from "../Grid";
import { getOutdoorAreaSimple } from "./outdoorArea";
import { calculateViewDistance } from "./viewDistance";
import { calculateApartmentCount } from "./sellableApartments";

type AnalysisResult = {
  outdoor: number;
  view: number;
  sellableApartments: number;
};

export function getAnalysisScore(grid: Grid) {
  const result = runAnalysis(grid);
  return evaluate(result);
}

function evaluate(result: AnalysisResult) {
  return (result.view + result.sellableApartments + result.outdoor) / 3;
}

export function runAnalysis(grid: Grid): AnalysisResult {
  return {
    outdoor: getOutdoorAreaSimple(grid), //getOutdoorAreaScore(grid)
    view: calculateViewDistance(grid),
    sellableApartments: calculateApartmentCount(grid),
  };
}
