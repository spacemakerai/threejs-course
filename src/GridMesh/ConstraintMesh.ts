/**
 * Efficient implementation of the boxes mesh
 * */
import { BufferAttribute, BufferGeometry, FrontSide, Group, Mesh, MeshLambertMaterial } from "three";
import Grid, { CELL_SIZE, GRID_CELL_COUNT } from "../Grid";
import { getBoxGeometry } from "./GridMesh";

export const BOX_MATERIAL = new MeshLambertMaterial({
  side: FrontSide,
  transparent: true,
  opacity: 0.2,
  color: 0xff0000,
});

export interface IGridMesh extends Group {
  update(grid: Grid): void;
}

export default class ConstraintMesh extends Group implements IGridMesh {
  mesh: Mesh;

  constructor(grid: Grid) {
    super();
    this.mesh = new Mesh(new BufferGeometry(), BOX_MATERIAL);
    this.add(this.mesh);

    this.update(grid);
  }

  update(grid: Grid) {
    const meshPositions: [number, number, number][] = [];

    for (let x = 0; x < GRID_CELL_COUNT.x; x++) {
      for (let y = 0; y < GRID_CELL_COUNT.y; y++) {
        const floors = grid.getCellValue(x, y);
        if (floors === 0) continue;

        const height = floors * CELL_SIZE.z;

        const x0 = x * CELL_SIZE.x;
        const x1 = x * CELL_SIZE.x + CELL_SIZE.x;
        const y0 = y * CELL_SIZE.y;
        const y1 = y * CELL_SIZE.y + CELL_SIZE.y;

        meshPositions.push(...getBoxGeometry(x0, y0, y1, x1, height));
      }
    }

    this.mesh.geometry.setAttribute("position", new BufferAttribute(new Float32Array(meshPositions.flat()), 3));
    this.mesh.geometry.attributes.position.needsUpdate = true;

    this.mesh.geometry.deleteAttribute("normal");
    this.mesh.geometry.computeVertexNormals();
  }
}
