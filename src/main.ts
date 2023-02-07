import "./style.css";
import * as THREE from "three";
import Grid, { CELL_HEIGHT, CELL_WIDTH_DEPTH } from "./Grid";
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
import { AxesHelper, Camera, Renderer, Scene, Vector3 } from "three";
import GroupOfBoxes from "./GridMesh/GroupOfBoxes";
import GridMesh, { IGridMesh } from "./GridMesh/GridMesh";

const NUMERIC_OFFSET = 1e-3;
let scene: Scene;
let camera: Camera;
const canvas: HTMLCanvasElement = document.getElementById("app")! as HTMLCanvasElement;
let renderer: Renderer;
// TASK 1 - Setting up a scene to render
function task1() {
  scene = new Scene();
  camera = setupCamera();
  scene.add(new AxesHelper(1));
  renderer = setupRenderer(canvas);
  renderer.render(scene, camera);
}
task1();

function task1b() {
  setupControls(camera, renderer);
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
task1b();

function task2() {
  const geometry = new THREE.BoxGeometry(CELL_WIDTH_DEPTH, CELL_WIDTH_DEPTH, CELL_HEIGHT);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}
task2();

function task3() {
  const ground = new Ground();
  scene.add(ground);
}
task3();

function task4() {
  camera.position.set(Grid.center.x, Grid.center.y - 30, 30);
  camera.lookAt(Grid.center.x, Grid.center.y, 0);
}
task4();

function task5() {
  const dirlight = getDirLight();
  scene.add(dirlight.target);
  scene.add(dirlight);
  scene.add(getAmbientLight());
}
task5();

let grid: Grid;
//Task: Create a grid using our provided Grid class, and try to use the functions exposed in it to set the number of
// floors for a position of your choice. Check that it worked by console.log()ing the result.
function task6() {
  grid = new Grid(); //to be added as task: State.load() || new Grid();
  grid.setCellValue(10, 10, 4);
}
task6();

let gridMesh: IGridMesh;
//Task: Now we want to render the grid we defined in task 6 as 3D boxes. Define and add the GroupOfBoxes class to the
//scene, and implement the necessary functions inside GroupOfBoxes.ts.
function task7a() {
  gridMesh = new GroupOfBoxes(grid);
  scene.add(gridMesh);
}

task7a();

function task900() {
  gridMesh = new GridMesh();
  gridMesh.update(grid);
}
task900();

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
