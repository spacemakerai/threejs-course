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
import Grid from "./Grid";
import { getAnalysisScore } from "./analysis";
import { State } from "./state";
import { calculateNormalizedDeviceCoordinates } from "./mousePosition";

import { findClosestClickedObject } from "./raycasting";
import { simulatedAnnealing } from "./optimize/simulatedAnnealing";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GroupOfBoxes from "./GridMesh/GroupOfBoxes";
import ConstraintMesh from "./GridMesh/ConstraintMesh";
import { constraintGrid } from "./constraint";
import { CELL_SIZE, GRID_CENTER, GRID_SIZE } from "./constants";

const fov = 75;
const aspectRatio = window.innerWidth / window.innerHeight;
const frustumNearPlane = 0.1;
const frustumFarPlane = 1000;

const cameraUpAxis = new Vector3(0, 0, 1);
const cameraInitialPosition = new Vector3(-5, -5, 1);
const cameraPointToLookAt = new Vector3(0, 0, 0);

/**
 * First we need to get the html element we want to draw everything on ....
 * */
const canvas: HTMLCanvasElement = document.getElementById("app")! as HTMLCanvasElement;

/**
 * ====== TASK 1 ======
 *
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
 * ====== TASK 2 ======
 * The WebGLRenderer is responsible for drawing the scene on the canvas, viewed from the cameras position
 *
 * Task:
 * - Initialize the WebGLRenderer with the canvas
 * -
 *
 * */

const renderer = new WebGLRenderer({ canvas, antialias: true });
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

const directionalLight = new DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(-100, -20, 60);
scene.add(directionalLight);
scene.add(new DirectionalLightHelper(directionalLight));

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
 * Imagine we have a grid that has nxm cells, where each cell represents a spot where a building can be placed:
 *
 * +---+---+---+---+
 * | o | o | o | o |
 * +---+---+---+---+
 * | o | o | o | o |
 * +---+---+---+---+
 * | o | o | o | o |
 * +---+---+---+---+
 * | o | o | o | o |
 * +---+---+---+---+
 *
 * This is our site!
 * Let's start by adding the ground on the site that the buildings can stand on top of.
 * It needs to be as large as the size of the grid. The size of the grid can be found in the GRID_SIZE variable!
 *
 * Task:
 * - Create a PlaneGeometry equal to the size of the grid.
 * - Create a MeshLambertMaterial to make it react to lighting (give it a color if you'd like!)
 * - Create a mesh from the geometry and the material
 *
 */

const groundGeometry = new PlaneGeometry(GRID_SIZE.x, GRID_SIZE.y);
const groundMaterial = new MeshLambertMaterial({ color: 0xaaaaaa });
const groundMesh = new Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

//TODO: Separate task to set position to make positioning clearer and more understandable?
groundMesh.position.set(GRID_CENTER.x, GRID_CENTER.y, 0);

/**
 * It would be nice to have the camera looking in the middle of the
 */

camera.position.set(GRID_CENTER.x, GRID_CENTER.y - 70, 80);
controls.target.set(GRID_CENTER.x, GRID_CENTER.y, 0);
controls.update();

/**
 * For our buildings, we will use a simple 2d grid, with the cell value representing the number of floors.
 *
 * This is our domain model, a pure Javascript/Typescript object which does not have anything with Three.js to do.
 * Separating our domain model and the visual rendering is important when the application grow.
 *
 * Task:
 * - Create a grid using our provided Grid class
 * - Use the functions Grid.setCellValue() and Grid.getCellValue() in it to set the number of floors for a position
 *   of your choice.
 * - Check that it worked by console.log()ing the result.
 */

const grid = new Grid();
grid.setCellValue(5, 5, 5);

/**
 * Now it would be nice to draw the buildings in the Scene.
 *
 * We have created a class which takes in a grid and will create boxes for representing the buildings. However, the
 * implementation is not complete.
 *
 * Task:
 * - Uncomment the two lines below
 * - Go into the GroupOfBoxes class and complete the implementation of the method "addBoxAtGridIndex"
 * - Play around with setting different values in the Grid. Remember to call .update(grid) on the GroupOfBoxes class
 *   after you edit the grid
 */

const gridMesh = new GroupOfBoxes(grid);
scene.add(gridMesh);

/**  */

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
  const closestIntersection = findClosestClickedObject([gridMesh, groundMesh], normalizedCoordinates, camera);
  if (!closestIntersection) return;
  const { x, y } = screenToGridCoordinates(closestIntersection.point);

  const diff = event.shiftKey ? -1 : 1;
  const prevVal = grid.getCellValue(x, y);
  const newVal = prevVal + diff;

  grid.setCellValue(x, y, newVal);
  State.save(grid);
  gridMesh.update(grid);

  //calculateViewDistance(grid, true);

  console.log(getAnalysisScore(grid));
}

function screenToGridCoordinates(screenCoordinates: Vector3) {
  const x = Math.floor(screenCoordinates.x / CELL_SIZE.x);
  const y = Math.floor(screenCoordinates.y / CELL_SIZE.y);
  return { x, y };
}

function onmousedown(event: MouseEvent) {
  mousedownEvent = event;
}
const constraintMesh = new ConstraintMesh(constraintGrid);
scene.add(constraintMesh);

let mousedownEvent: MouseEvent | undefined;
window.addEventListener("mouseup", onmouseup);
window.addEventListener("mousedown", onmousedown);

document.getElementById("search")?.addEventListener("click", () => {
  const sa = simulatedAnnealing(new Grid(), 50_000, 10);
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
