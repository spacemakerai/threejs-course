/**
 * Efficient implementation of the boxes mesh
 * */
import { BufferAttribute, BufferGeometry, FrontSide, Group, Mesh, MeshLambertMaterial } from "three";
import Grid, { CELL_HEIGHT, CELL_WIDTH_DEPTH, GRID_DEPTH, GRID_WIDTH } from "../Grid";
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

    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_DEPTH; y++) {
        const floors = grid.getCellValue(x, y);
        if (floors === 0) continue;

        const height = floors * CELL_HEIGHT;

        const x0 = x * CELL_WIDTH_DEPTH;
        const x1 = x * CELL_WIDTH_DEPTH + CELL_WIDTH_DEPTH;
        const y0 = y * CELL_WIDTH_DEPTH;
        const y1 = y * CELL_WIDTH_DEPTH + CELL_WIDTH_DEPTH;

        meshPositions.push(...getBoxGeometry(x0, y0, y1, x1, height));
      }
    }

    this.mesh.geometry.setAttribute("position", new BufferAttribute(new Float32Array(meshPositions.flat()), 3));
    this.mesh.geometry.attributes.position.needsUpdate = true;

    this.mesh.geometry.deleteAttribute("normal");
    this.mesh.geometry.computeVertexNormals();
  }
}
