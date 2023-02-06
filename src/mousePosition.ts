import { Vector2 } from "three";

const mouse = new Vector2();
export function calculateNormalizedDeviceCoordinates(event: MouseEvent, canvas: HTMLCanvasElement) {
  let x = (event.offsetX / canvas.clientWidth) * 2 - 1;
  let y = -(event.offsetY / canvas.clientHeight) * 2 + 1;
  mouse.set(x, y);
  return mouse;
}
