import { BoxGeometry, FrontSide, Group, LineBasicMaterial, LineSegments, Mesh, MeshLambertMaterial, Vector3 } from "three";
import Grid from "../Grid";
import { IGridMesh } from "./GridMesh";
import { CELL_SIZE, GRID_CELL_COUNT } from "../constants";

export const BOX_MATERIAL = new MeshLambertMaterial({
  side: FrontSide,
  shadowSide: FrontSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
});

export const EDGES_MATERIAL = new LineBasicMaterial({ color: 0x444444 });

export default class GroupOfBoxes extends Group implements IGridMesh {
  constructor(grid: Grid) {
    super();
    this.update(grid);
  }

  update(grid: Grid) {
    this.cleanup();

    for (let x = 0; x < GRID_CELL_COUNT.x; x++) {
      for (let y = 0; y < GRID_CELL_COUNT.y; y++) {
        const floors = grid.getCellValue(x, y);
        if (floors > 0) {
          this.addBoxAtGridIndex(x, y, floors);
        }
      }
    }
  }

  addBoxAtGridIndex(x: number, y: number, floors: number) {
    const height = floors * CELL_SIZE.z;
    const size = new Vector3(CELL_SIZE.x, CELL_SIZE.y, height);

    const box = new Mesh(new BoxGeometry(size.x, size.y, size.z), BOX_MATERIAL);

    const gridPosition = new Vector3().multiplyVectors(CELL_SIZE, new Vector3(x, y, 0));
    const centerOffset = new Vector3().copy(size).divideScalar(2);

    box.position.copy(gridPosition.add(centerOffset));
    this.add(box);
  }

  cleanup() {
    const children = [...this.children];
    for (let child of children) {
      this.remove(child);
      if (child instanceof Mesh || child instanceof LineSegments) {
        child.geometry.dispose();
      }
    }
  }
}
