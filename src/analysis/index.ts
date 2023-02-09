import Grid from "../Grid";
import { getOutdoorAreaSimple } from "./outdoorArea";
import { calculateViewDistance } from "./viewDistance";
import { calculateApartmentCount } from "./sellableApartments";
import { constraintAnalysis } from "./constraint";

type AnalysisResult = {
  outdoor: number;
  view: number;
  sellableApartments: number;
  constraint: number;
};

export function getAnalysisScore(grid: Grid) {
  const result = runAnalysis(grid);
  return evaluate(result);
}

export function evaluate(result: AnalysisResult) {
  return (result.view + result.sellableApartments + result.outdoor) / 3 + result.constraint;
}

export function runAnalysis(grid: Grid): AnalysisResult {
  return {
    outdoor: getOutdoorAreaSimple(grid),
    view: calculateViewDistance(grid),
    sellableApartments: calculateApartmentCount(grid),
    constraint: constraintAnalysis(grid),
  };
}
