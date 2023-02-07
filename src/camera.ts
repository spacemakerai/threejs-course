import * as THREE from "three";

export function setupCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.up.set(0, 0, 1);
  camera.position.set(-5, -5, 1);
  camera.lookAt(0, 0, 0);
  return camera;
}
