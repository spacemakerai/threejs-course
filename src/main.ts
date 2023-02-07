import "./style.css";
import * as THREE from "three";
import {
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import Grid, { CELL_WIDTH_DEPTH, GRID_DEPTH, GRID_WIDTH } from "./Grid";
import Ground from "./Ground";
import { getAmbientLight, getDirLight } from "./Lights";
import { getAnalysisScore } from "./analysis";
import { State } from "./state";
import { calculateNormalizedDeviceCoordinates } from "./mousePosition";

import { findClosestClickedObject } from "./raycasting";
import GroupOfBoxes from "./GridMesh/GroupOfBoxes";
import { IGridMesh } from "./GridMesh/GridMesh";
import { simulatedAnnealing } from "./optimize/simulatedAnnealing";
import { calculateViewDistance } from "./analysis/viewDistance";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const fov = 75;
const aspectRatio = window.innerWidth / window.innerHeight;
const frustumNearPlane = 0.1;
const frustumFarPlane = 1000;

const cameraUpAxis = new Vector3(0, 0, 1);
const cameraInitialPosition = new Vector3(-5, -5, 1);
const cameraPointToLookAt = new Vector3(0, 0, 0);

// TODO: Remove
const NUMERIC_OFFSET = 1e-3;

/**
 * First we need to get the html element we want to draw everything on ....
 * */
const canvas: HTMLCanvasElement = document.getElementById("app")! as HTMLCanvasElement;

/**
 * The Scene is the...
 *
 * Docs:
 * https://threejs.org/docs/#api/en/scenes/Scene
 * */
const scene = new Scene();
const camera = new PerspectiveCamera(fov, aspectRatio, frustumNearPlane, frustumFarPlane);

camera.up = cameraUpAxis;
camera.position.copy(cameraInitialPosition);
camera.lookAt(cameraPointToLookAt);

/**
 * The WebGLRenderer is responsible for drawing the scene on the canvas, viewed from the cameras position
 *
 * Task:
 * - Initialize the WebGLRenderer with the canvas
 * -
 *
 * */

const renderer = new WebGLRenderer({ canvas });
renderer.render(scene, camera);

/**
 * WOHOO! ThreeJs is now responsible for drawing the canvas. Let's add some content!
 *
 * Use the example to add a box
 * https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry
 * */

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
renderer.render(scene, camera);

/**
 * Nice, we now have a cube, but it is so blurry!!
 *
 * Task: Use the WebGlRenderer.setSize() to set the renderer size to match the canvas
 *
 * Tip: The canvas size can be found as the properties canvas.clientWidth and canvas.clientHeight
 *
 * */

renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.render(scene, camera);

/**
 * You can also set the background color to something less depressing using render.setClearColor
 * */

renderer.setClearColor("SkyBlue", 1);

/**
 * Animation loop
 * You probably think it is annoying to have to write renderer.render every time you add something to the scene
 * We can ask your browser to call this function 60 times per second automatically
 *
 * Task:
 * - Add the renderer.render function call into the animate function.
 * - Remove the manual renderer.render function calls you have already written, and see that this works
 *
 * Note:
 * This will draw the scene all the time. In production environments you most likely want to be smart about
 * when you actually call render(), to avoid rendering when there are no updates to the scene, to
 * save computation time for other
 * */

function animate() {
  renderer.render(scene, camera); // Remove
  requestAnimationFrame(animate);
}
animate();

/**
 * It would be nice to be able to move the camera around. This is a bit complicated, but luckily Three.js have an
 * example we can use out of the box which works well enough for this course. It can be added by new OrbitControls
 *
 * OrbitControls work by taking in the camera and the canvas and listening to mouse events on the canvas to calculate
 * how far to move or rotate the camera – which it does by mutating properties on the passed-in camera.
 *
 * Task: Create new OrbitControls and assign it to a variable `controls` so we can reference it later.
 * */

const controls = new OrbitControls(camera, renderer.domElement);

/**
 * The cube is very green! Why don't we make it look slightly less jarring?
 * Task: Mutate the `color` property on the material to white.
 * */

material.color.set(0xffffff);

/**
 * The shape of the box is just one big blob – that's because the mesh's material is not affected by lights and that
 * we have no lights!
 *
 *
 * Task:
 * - Change the material of the cube from MeshBasicMaterial to MeshLambertMaterial
 * - Create a DirectionalLight https://threejs.org/docs/index.html?q=direct#api/en/lights/DirectionalLight
 * - Add the light to the scene
 * - Position the light at position (-2, -5, 10)
 *
 * We suggest using an intensity of 0.7
 * Tip: If you want to view where the light is placed, you can use add a new DirectionalLightHelper to the scene!
 */

const directionalLight = new DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-2, 0, 10);
scene.add(directionalLight);

/**
 * The side of the cube that is in the shadow is completely black, making it hard to see anything.
 * That can be fixed by having some ambient light!
 *
 *
 * Task:
 * - Add a new AmbientLight to the scene
 *
 * We suggest using an intensity of 0.4
 *
 * */

const ambientLight = new AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

/**
 * Lets start building Spacemaker light version!
 *
 * Demo
 *
 * Let's start by adding the ground where the buildings can stand.
 *
 * Task:
 * - Create a PlaneGeometry
 * - Create a MeshLambertMaterial
 * - Create a mesh from the geometry and the material
 * - To make it easier to think about positioning on the ground, we want XY (0,0) to be in the bottom left corner
 *   of the ground. By default, a mesh's position is calculated from the middle of the mesh  ...blabla
 */

const groundGeometry = new PlaneGeometry(GRID_WIDTH * CELL_WIDTH_DEPTH, GRID_DEPTH * CELL_WIDTH_DEPTH);
const groundMaterial = new MeshLambertMaterial();
const groundMesh = new Mesh(groundGeometry, groundMaterial);
groundMesh.position.set((GRID_WIDTH * CELL_WIDTH_DEPTH) / 2, (GRID_DEPTH * CELL_WIDTH_DEPTH) / 2, 0);
scene.add(groundMesh);

/**
 * It would be nice to have the camera looking in the middle of the
 */

camera.position.set(Grid.center.x, Grid.center.y - 70, 80);
controls.target.set(Grid.center.x, Grid.center.y, 0);
controls.update();

/**
 * Grid time
 *
 * Task: Create a grid using our provided Grid class, and try to use the functions exposed in it to set the number of
 * floors for a position of your choice. Check that it worked by console.log()ing the result.
 *
 * - Add a builing to the grid, with grid.setCellValue(x, y, height)
 */

const grid = new Grid();
grid.setCellValue(5, 5, 5);

/**
 * Create the mesh and add it to the scene
 */
const gridMesh = new GroupOfBoxes(grid);
scene.add(gridMesh);

//task7a();

/** extra task todo
 * The edges of the cube are not pretty. This is due to aliasing
 */
// function task900() {
//   gridMesh = new GridMesh();
//   gridMesh.update(grid);
// }
// task900();

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

  calculateViewDistance(grid, true);

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
  const sa = simulatedAnnealing(new Grid(), 100_000, 100);
  function simulate() {
    const candidate = sa.next();
    gridMesh.update(candidate.value);
    renderer.render(scene, camera);
    if (!candidate.done) {
      requestAnimationFrame(simulate);
    } else {
      grid.decode(candidate.value.encode());
    }
  }
  simulate();
});
