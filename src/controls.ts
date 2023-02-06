import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Grid from "./Grid";
import { Camera, Renderer } from "three";

export function setupControls(camera: Camera, renderer: Renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(Grid.center.x, Grid.center.y, 0);
  controls.update();
}
