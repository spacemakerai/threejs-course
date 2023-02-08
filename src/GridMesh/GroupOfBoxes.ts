import { BoxGeometry, EdgesGeometry, FrontSide, Group, LineBasicMaterial, LineSegments, Mesh, MeshLambertMaterial } from "three";
import Grid, { CELL_SIZE, GRID_CELL_COUNT } from "../Grid";
import { IGridMesh } from "./GridMesh";

export const BOX_MATERIAL = new MeshLambertMaterial({
  side: FrontSide,
  shadowSide: FrontSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
});

export const EDGES_MATERIAL = new LineBasicMaterial({ color: 0x444444 });

export default class GroupOfBoxes extends Group implements IGridMesh {
  #grid: Grid;

  constructor(grid: Grid) {
    super();

    this.#grid = grid;
    this.update(grid);
  }

  update(grid: Grid) {
    this.#grid = grid;
    const children = [...this.children];
    for (let child of children) {
      this.remove(child);
      if (child instanceof Mesh) {
        child.geometry.dispose();
      }
    }

    for (let x = 0; x < GRID_CELL_COUNT.x; x++) {
      for (let y = 0; y < GRID_CELL_COUNT.y; y++) {
        for (let z = 0; z < GRID_CELL_COUNT.z; z++) {
          const hasBox = this.#grid.getCellValue(x, y) >= z + 1;
          if (hasBox) {
            const box = new Mesh(new BoxGeometry(CELL_SIZE.x, CELL_SIZE.y, CELL_SIZE.z), BOX_MATERIAL);
            const edges = new EdgesGeometry(box.geometry);
            const line = new LineSegments(edges, EDGES_MATERIAL);
            box.add(line);

            box.castShadow = true;
            box.receiveShadow = true;
            box.position.set(CELL_SIZE.x / 2 + x * CELL_SIZE.x, CELL_SIZE.y / 2 + y * CELL_SIZE.y, CELL_SIZE.z / 2 + z * CELL_SIZE.z);
            this.add(box);
          }
        }
      }
    }
  }
}
