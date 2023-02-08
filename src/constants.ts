import { Vector2, Vector3 } from "three";

export const CELL_SIZE = new Vector3(6, 6, 3);
export const GRID_CELL_COUNT = new Vector3(20, 20, 10);
export const GRID_SIZE = new Vector3().multiplyVectors(CELL_SIZE, GRID_CELL_COUNT);
export const GRID_CENTER = new Vector2(GRID_SIZE.x / 2, GRID_SIZE.y / 2);
