import "./style.css";
import * as THREE from "three";
import { Intersection, Raycaster, Vector2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Grid, { CELL_WIDTH_DEPTH, GRID_DEPTH, GRID_WIDTH } from "./Grid";
import Ground from "./Ground";
import GroupOfBoxes from "./GroupOfBoxes";
import { getAmbientLight, getDirLight } from "./Lights";
import { getAnalysisScore } from "./analysis";
import { SimulatedAnnealing } from "./optimize/simulatedAnnealing";

export const center = new Vector2((GRID_WIDTH * CELL_WIDTH_DEPTH) / 2, (GRID_DEPTH * CELL_WIDTH_DEPTH) / 2);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.up.set(0, 0, 1);
camera.position.set(center.x, center.y - 30, 30);

const canvas = document.getElementById("app")!;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0xaaaaff, 1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(center.x, center.y, 0);
controls.update();

const ground = new Ground();
scene.add(ground);

const dirlight = getDirLight();
scene.add(dirlight);
scene.add(dirlight.target);
dirlight.position.set(0, 0, 100);
dirlight.target.position.set(center.x, center.y, 0);

scene.add(getAmbientLight());

const grid = new Grid();
const gridMesh = new GroupOfBoxes(grid);
scene.add(gridMesh);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const encoded = new URLSearchParams(window.location.search).get("gridState");
if (encoded) {
  console.log(encoded);
  grid.decode(encoded);
  gridMesh.update();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

const mouse = new Vector2();
const raycaster = new Raycaster();

let mousedownEvent: MouseEvent | undefined;
function movedWhileClicking(down: MouseEvent | undefined, up: MouseEvent): boolean {
  if (!down) return false;
  const distSq = (down.offsetX - up.offsetX) ** 2 + (down.offsetY - up.offsetY) ** 2;
  console.log(distSq);
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
function calculateNormalizedDeviceCoordinates(event: MouseEvent) {
  let x = (event.offsetX / canvas.clientWidth) * 2 - 1;
  let y = -(event.offsetY / canvas.clientHeight) * 2 + 1;
  return { x, y };
}

function findClosestClickedObject(x: number, y: number) {
  mouse.set(x, y);
  raycaster.setFromCamera(mouse, camera);
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

  const normalizedCoordinates = calculateNormalizedDeviceCoordinates(event);

  const closestIntersection = findClosestClickedObject(normalizedCoordinates.x, normalizedCoordinates.y);
  if (!closestIntersection) return;

  if (!closestIntersection.face) return; // We only allow clicking on top faces
  if (!isTopFace(closestIntersection)) return;

  const x = Math.floor(closestIntersection.point.x / CELL_WIDTH_DEPTH);
  const y = Math.floor(closestIntersection.point.y / CELL_WIDTH_DEPTH);

  const diff = event.shiftKey ? -1 : 1;
  const prevVal = grid.getCellValue(x, y);
  const newVal = prevVal + diff;

  grid.setCellValue(x, y, newVal);
  updateUrlWithState(grid);
  gridMesh.update();

  console.log(getAnalysisScore(grid));
}

function updateUrlWithState(grid: Grid): void {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set("gridState", grid.encode());
  const newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newRelativePathQuery);
}

function onmousedown(event: MouseEvent) {
  mousedownEvent = event;
}

window.addEventListener("mouseup", onmouseup);
window.addEventListener("mousedown", onmousedown);

document.getElementById("search")?.addEventListener("click", () => {
  const sa = new SimulatedAnnealing(new Grid());
  sa.run(10_000);
  grid.decode(sa.grid.encode());
  gridMesh.update();
});
