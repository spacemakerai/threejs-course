import * as THREE from "three";
import { Mesh, MeshLambertMaterial } from "three";
import { CELL_WIDTH_DEPTH, GRID_DEPTH, GRID_WIDTH } from "./Grid";

export default class Ground extends Mesh {
  constructor() {
    const geometry = new THREE.PlaneGeometry(
      GRID_WIDTH * CELL_WIDTH_DEPTH,
      GRID_DEPTH * CELL_WIDTH_DEPTH,
      GRID_WIDTH,
      GRID_DEPTH
    );
    const material = new MeshLambertMaterial({
      color: 0xaaaaaa,
      wireframe: false,
    });
    super(geometry, material);
    this.position.set(
      (GRID_WIDTH * CELL_WIDTH_DEPTH) / 2,
      (GRID_DEPTH * CELL_WIDTH_DEPTH) / 2,
      0
    );
    this.receiveShadow = true;
  }
}
