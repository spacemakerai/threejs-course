import "./style.css";
import * as THREE from "three";
import { Intersection, Raycaster, Vector2 } from "three";
import Grid, { CELL_WIDTH_DEPTH } from "./Grid";
import Ground from "./Ground";
import GroupOfBoxes from "./GroupOfBoxes";
import { getAmbientLight, getDirLight } from "./Lights";
import { getAnalysisScore } from "./analysis";
import { State } from "./state";
import { setupCamera } from "./camera";
import { setupRenderer } from "./renderer";
import { setupControls } from "./controls";
import { calculateNormalizedDeviceCoordinates } from "./mousePosition";
import { SimulatedAnnealing } from "./optimize/simulatedAnnealing";

const scene = new THREE.Scene();
const camera = setupCamera();
const canvas: HTMLCanvasElement = document.getElementById("app")! as HTMLCanvasElement;

const renderer = setupRenderer(canvas);

setupControls(camera, renderer);

const ground = new Ground();
scene.add(ground);

const dirlight = getDirLight();
scene.add(dirlight);
scene.add(dirlight.target);
scene.add(getAmbientLight());

const grid = State.load() || new Grid();
const gridMesh = new GroupOfBoxes(grid);
scene.add(gridMesh);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

const raycaster = new Raycaster();

function movedWhileClicking(down: MouseEvent | undefined, up: MouseEvent): boolean {
  if (!down) return false;
  const distSq = (down.offsetX - up.offsetX) ** 2 + (down.offsetY - up.offsetY) ** 2;
  return distSq > 4 ** 2;
}

/**
 * Normalized device coordinate or NDC space is a screen independent display coordinate system;
 * it encompasses a square where the x and y components range from 0 to 1.
 *
  |⎻⎻⎻⎻1
  |    |
  |    |
  0____|
 */

function findClosestClickedObject(mousePosition: Vector2) {
  raycaster.setFromCamera(mousePosition, camera);
  const intersections = raycaster.intersectObject(scene, true);
  const closestIntersection = intersections.length >= 1 ? intersections[0] : null;
  return closestIntersection;
}

function isTopFace(closestIntersection: Intersection) {
  return closestIntersection.face && closestIntersection.face.normal.z > 0.99;
}

// const sa = new SimulatedAnnealing(new Grid());
// sa.run();
//
// grid.decode(sa.grid.encode());
// gridMesh.update();

function onmouseup(event: MouseEvent) {
  if (movedWhileClicking(mousedownEvent, event)) {
    return;
  }

  const normalizedCoordinates = calculateNormalizedDeviceCoordinates(event, canvas);

  const closestIntersection = findClosestClickedObject(normalizedCoordinates);
  if (!closestIntersection) return;

  if (!closestIntersection.face) return; // We only allow clicking on top faces
  if (!isTopFace(closestIntersection)) return;

  const x = Math.floor(closestIntersection.point.x / CELL_WIDTH_DEPTH);
  const y = Math.floor(closestIntersection.point.y / CELL_WIDTH_DEPTH);

  const diff = event.shiftKey ? -1 : 1;
  const prevVal = grid.getCellValue(x, y);
  const newVal = prevVal + diff;

  grid.setCellValue(x, y, newVal);
  State.save(grid);
  gridMesh.update();

  console.log(getAnalysisScore(grid));
}

function onmousedown(event: MouseEvent) {
  mousedownEvent = event;
}

let mousedownEvent: MouseEvent | undefined;
window.addEventListener("mouseup", onmouseup);
window.addEventListener("mousedown", onmousedown);

document.getElementById("search")?.addEventListener("click", () => {
  const sa = new SimulatedAnnealing(new Grid());
  sa.run(40_000);
  grid.decode(sa.grid.encode());
  gridMesh.update();
});
