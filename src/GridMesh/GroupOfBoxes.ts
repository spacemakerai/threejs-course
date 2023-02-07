import { BoxGeometry, EdgesGeometry, FrontSide, Group, LineBasicMaterial, LineSegments, Mesh, MeshLambertMaterial } from "three";
import Grid, { CELL_HEIGHT, CELL_WIDTH_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../Grid";

export const BOX_MATERIAL = new MeshLambertMaterial({
  side: FrontSide,
  shadowSide: FrontSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
});

export const EDGES_MATERIAL = new LineBasicMaterial({ color: 0x444444 });

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
          const hasBox = this.#grid.getCellValue(x, y) >= z + 1;
          if (hasBox) {
            const box = new Mesh(new BoxGeometry(CELL_WIDTH_DEPTH, CELL_WIDTH_DEPTH, CELL_HEIGHT), BOX_MATERIAL);
            const edges = new EdgesGeometry(box.geometry);
            const line = new LineSegments(edges, EDGES_MATERIAL);
            box.add(line);

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
