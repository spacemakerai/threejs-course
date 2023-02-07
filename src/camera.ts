import * as THREE from "three";
import { Vector3 } from "three";

const fov = 75;
const aspectRatio = window.innerWidth / window.innerHeight;
const frustumNearPlane = 0.1;
const frustumFarPlane = 1000;

const cameraUpAxis = new Vector3(0, 0, 1);
export const cameraInitialPosition = new Vector3(-5, -5, 1);
const cameraPointToLookAt = new Vector3(0, 0, 0);

/*
 * TASK 1: Setting up the camera
 * Create a new PerspectiveCamera and define up, its position and what it should lookAt according to the variables
 * we've defined above.
 */
export function setupCamera() {
  const camera = new THREE.PerspectiveCamera(fov, aspectRatio, frustumNearPlane, frustumFarPlane);

  camera.up = cameraUpAxis;
  camera.position.copy(cameraInitialPosition);
  camera.lookAt(cameraPointToLookAt);
  return camera;
}
