import { AmbientLight, DirectionalLight } from "three";
import Grid, { CELL_WIDTH_DEPTH, GRID_SIZE_Y, GRID_SIZE_X } from "./Grid";

export function getDirLight() {
  const dirLight = new DirectionalLight(0xffffff, 0.7);

  dirLight.castShadow = true;
  dirLight.shadow.camera.left = (-CELL_WIDTH_DEPTH * GRID_SIZE_X) / 2;
  dirLight.shadow.camera.right = (CELL_WIDTH_DEPTH * GRID_SIZE_X) / 2;
  dirLight.shadow.camera.top = (-CELL_WIDTH_DEPTH * GRID_SIZE_Y) / 2;
  dirLight.shadow.camera.bottom = (CELL_WIDTH_DEPTH * GRID_SIZE_Y) / 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 2000;

  dirLight.shadow.normalBias = 0.5;

  dirLight.position.set(0, 0, 100);
  dirLight.target.position.set(Grid.center.x, Grid.center.y, 0);

  return dirLight;
}

export function getAmbientLight() {
  return new AmbientLight(0xffffff, 0.4);
}
