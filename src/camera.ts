import * as THREE from "three";
import Grid from "./Grid";

export function setupCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.up.set(0, 0, 1);
  camera.position.set(Grid.center.x, Grid.center.y - 30, 30);
  return camera;
}
