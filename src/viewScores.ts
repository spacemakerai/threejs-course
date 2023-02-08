import Grid from "./Grid";
import { evaluate, runAnalysis } from "./analysis";

export function viewScores(grid: Grid): void {
  const analysisScores = runAnalysis(grid);
  document.getElementById("viewScore")!.innerText = analysisScores.view.toFixed(3);
  document.getElementById("sellableApartments")!.innerText = analysisScores.sellableApartments.toFixed(3);
  document.getElementById("outdoorAreaScore")!.innerText = analysisScores.outdoor.toFixed(3);
  document.getElementById("constraint")!.innerText = analysisScores.constraint.toFixed(3);
  document.getElementById("total")!.innerText = evaluate(analysisScores).toFixed(3);
}
