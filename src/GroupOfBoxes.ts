import {
  BoxGeometry,
  EdgesGeometry,
  FrontSide,
  Group,
  Mesh,
  MeshLambertMaterial,
} from "three";
import Grid, {
  CELL_HEIGHT,
  CELL_WIDTH_DEPTH,
  GRID_HEIGHT,
  GRID_WIDTH,
} from "./Grid";

const BoxMaterial = new MeshLambertMaterial({
  shadowSide: FrontSide,
});

export default class GroupOfBoxes extends Group {
  #grid: Grid;

  constructor(grid: Grid) {
    super();

    this.#grid = grid;
    this.update();
  }

  update() {
    const children = [...this.children];
    for (let child of children) {
      this.remove(child);
      if (child instanceof Mesh) {
        child.geometry.dispose();
      }
    }

    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_WIDTH; y++) {
        for (let z = 0; z < GRID_HEIGHT; z++) {
          const hasBox = this.#grid.getCellValue(x, y, z);
          if (hasBox) {
            const box = new Mesh(
              new BoxGeometry(CELL_WIDTH_DEPTH, CELL_WIDTH_DEPTH, CELL_HEIGHT),
              BoxMaterial
            );
            const edges = new EdgesGeometry(box.geometry);
            box.castShadow = true;
            box.receiveShadow = true;
            box.position.set(
              CELL_WIDTH_DEPTH / 2 + x * CELL_WIDTH_DEPTH,
              CELL_WIDTH_DEPTH / 2 + y * CELL_WIDTH_DEPTH,
              CELL_HEIGHT / 2 + z * CELL_HEIGHT
            );
            this.add(box);
          }
        }
      }
    }
  }
}
