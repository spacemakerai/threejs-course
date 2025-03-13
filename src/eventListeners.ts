import Grid from "./Grid";
import { simulatedAnnealing } from "./optimize/simulatedAnnealing";
import { viewScores } from "./viewScores";
import { viewConstraints } from "./viewConstraints";
import { constraintGrid } from "./constraint";
import { IGridMesh } from "./GridMesh/GridMesh";
import { Camera, WebGLRenderer, Scene } from "three";
import { State } from "./state";

export function listenForButtonClicks(gridMesh: IGridMesh, renderer: WebGLRenderer, scene: Scene, camera: Camera, grid: Grid) {
  document.getElementById("search")?.addEventListener("click", () => {
    /*const fullGrid = new Grid();
    fullGrid.full();*/
    const emptyGrid = new Grid();
    const sa = simulatedAnnealing(emptyGrid, 100_000, 10);
    function simulate() {
      const candidate = sa.next();
      gridMesh.update(candidate.value);
      renderer.render(scene, camera);
      viewScores(candidate.value);
      if (!candidate.done) {
        requestAnimationFrame(simulate);
      } else {
        grid.decode(candidate.value.encode());
      }
    }
    simulate();
  });

  document.getElementById("save")?.addEventListener("click", () => {
    State.save(grid);
  });

  document.getElementById("load")?.addEventListener("click", () => {
    State.load(grid);
    gridMesh.update(grid);
    viewScores(grid);
  });
}
