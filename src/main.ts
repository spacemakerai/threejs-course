import "./style.css";
import * as THREE from "three";
import Grid, { CELL_WIDTH_DEPTH } from "./Grid";
import Ground from "./Ground";
import { getAmbientLight, getDirLight } from "./Lights";
import { getAnalysisScore } from "./analysis";
import { State } from "./state";
import { setupCamera } from "./camera";
import { setupRenderer } from "./renderer";
import { setupControls } from "./controls";
import { calculateNormalizedDeviceCoordinates } from "./mousePosition";
import { SimulatedAnnealing } from "./optimize/simulatedAnnealing";
import { findClosestClickedObject } from "./raycasting";
import { Vector3 } from "three";
import GridMesh from "./GridMesh/GridMesh";

const NUMERIC_OFFSET = 1e-3;

const scene = new THREE.Scene();
const camera = setupCamera();
const canvas: HTMLCanvasElement = document.getElementById("app")! as HTMLCanvasElement;

console.log(scene);

const renderer = setupRenderer(canvas);

setupControls(camera, renderer);

const ground = new Ground();
scene.add(ground);

const dirlight = getDirLight();
scene.add(dirlight);
scene.add(dirlight.target);
scene.add(getAmbientLight());

const grid = State.load() || new Grid();
const gridMesh = new GridMesh();
gridMesh.update(grid);
scene.add(gridMesh);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function movedWhileClicking(down: MouseEvent | undefined, up: MouseEvent): boolean {
  if (!down) return false;
  const distSq = (down.offsetX - up.offsetX) ** 2 + (down.offsetY - up.offsetY) ** 2;
  return distSq > 4 ** 2;
}

// const sa = new SimulatedAnnealing(new Grid());
// sa.run();
//
// grid.decode(sa.grid.encode());
// gridMesh.update();

function onmouseup(event: MouseEvent) {
  if (movedWhileClicking(mousedownEvent, event)) {
    //We don't want to add apartments if the user only wanted to move the camera
    return;
  }
  const normalizedCoordinates = calculateNormalizedDeviceCoordinates(event, canvas);
  const closestIntersection = findClosestClickedObject(normalizedCoordinates, scene, camera);
  if (!closestIntersection) return;
  const { x, y } = screenToGridCoordinates(closestIntersection.point);

  const diff = event.shiftKey ? -1 : 1;
  const prevVal = grid.getCellValue(x, y);
  const newVal = prevVal + diff;

  grid.setCellValue(x, y, newVal);
  State.save(grid);
  gridMesh.update(grid);

  console.log(getAnalysisScore(grid));
}

function screenToGridCoordinates(screenCoordinates: Vector3) {
  const x = Math.floor((screenCoordinates.x + NUMERIC_OFFSET) / CELL_WIDTH_DEPTH);
  const y = Math.floor((screenCoordinates.y + NUMERIC_OFFSET) / CELL_WIDTH_DEPTH);
  return { x, y };
}

function onmousedown(event: MouseEvent) {
  mousedownEvent = event;
}

let mousedownEvent: MouseEvent | undefined;
window.addEventListener("mouseup", onmouseup);
window.addEventListener("mousedown", onmousedown);

document.getElementById("search")?.addEventListener("click", () => {
  const sa = new SimulatedAnnealing(new Grid());
  sa.run(100_000);
  grid.decode(sa.grid.encode());
  gridMesh.update(sa.grid);
});
