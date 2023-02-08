import * as THREE from "three";
import { Mesh, MeshLambertMaterial } from "three";
import { CELL_WIDTH_DEPTH, GRID_SIZE_Y, GRID_SIZE_X } from "./Grid";

export default class Ground extends Mesh {
  constructor() {
    const geometry = new THREE.PlaneGeometry(GRID_SIZE_X * CELL_WIDTH_DEPTH, GRID_SIZE_Y * CELL_WIDTH_DEPTH, GRID_SIZE_X, GRID_SIZE_Y);
    const material = new MeshLambertMaterial();
    super(geometry, material);
    this.position.set((GRID_SIZE_X * CELL_WIDTH_DEPTH) / 2, (GRID_SIZE_Y * CELL_WIDTH_DEPTH) / 2, 0);
    this.receiveShadow = true;
  }
}
