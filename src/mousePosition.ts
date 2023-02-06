import { Vector2 } from "three";

const mouse = new Vector2();
/**
 * Normalized device coordinate or NDC space is a screen independent display coordinate system;
 * it encompasses a square where the x and y components range from 0 to 1.
 *
 |⎻⎻⎻⎻1
 |    |
 |    |
 0____|
 */
export function calculateNormalizedDeviceCoordinates(event: MouseEvent, canvas: HTMLCanvasElement) {
  let x = (event.offsetX / canvas.clientWidth) * 2 - 1;
  let y = -(event.offsetY / canvas.clientHeight) * 2 + 1;
  mouse.set(x, y);
  return mouse;
}
