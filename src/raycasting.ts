import { Camera, Intersection, Mesh, Object3D, Raycaster, Vector2 } from "three";

const raycaster = new Raycaster();
export function findClosestClickedObject(racastTargets: Object3D[], mousePosition: Vector2, camera: Camera) {
  raycaster.setFromCamera(mousePosition, camera);
  const intersections = raycaster.intersectObjects(racastTargets, true);
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
