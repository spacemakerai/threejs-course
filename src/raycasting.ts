import { Camera, Intersection, Mesh, Raycaster, Scene, Vector2 } from "three";

const raycaster = new Raycaster();
export function findClosestClickedObject(mousePosition: Vector2, scene: Scene, camera: Camera) {
  raycaster.setFromCamera(mousePosition, camera);
  const intersections = raycaster.intersectObject(scene, true);
  const closestIntersection = intersections.find((i) => i.object instanceof Mesh);
  if (!closestIntersection) return;
  if (!closestIntersection.face) return;
  // We only allow clicking on top faces
  if (!isTopFace(closestIntersection)) return;
  return closestIntersection;
}

function isTopFace(closestIntersection: Intersection) {
  return closestIntersection.face && closestIntersection.face.normal.z > 0.99;
}
