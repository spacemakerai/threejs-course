/**
 * Efficient implementation of the boxes mesh
 * */
import { BufferAttribute, BufferGeometry, Group, LineSegments, Mesh } from "three";
import Grid from "../Grid";
import { BOX_MATERIAL, EDGES_MATERIAL } from "./GroupOfBoxes";
import { CELL_SIZE, GRID_CELL_COUNT } from "../constants";

export interface IGridMesh extends Group {
  update(grid: Grid): void;
}

export default class GridMesh extends Group implements IGridMesh {
  mesh: Mesh;
  lineSegments: LineSegments;

  constructor(grid: Grid) {
    super();
    this.mesh = new Mesh(new BufferGeometry(), BOX_MATERIAL);
    this.lineSegments = new LineSegments(new BufferGeometry(), EDGES_MATERIAL);
    this.add(this.mesh, this.lineSegments);

    this.update(grid);
  }

  update(grid: Grid) {
    const meshPositions: [number, number, number][] = [];
    const lineSegmentsPositions: [number, number, number][] = [];

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
        lineSegmentsPositions.push(...getLineSegments(x0, y0, y1, x1, height));
      }
    }

    this.mesh.geometry.setAttribute("position", new BufferAttribute(new Float32Array(meshPositions.flat()), 3));
    this.mesh.geometry.attributes.position.needsUpdate = true;

    this.mesh.geometry.deleteAttribute("normal");
    this.mesh.geometry.computeVertexNormals();

    this.lineSegments.geometry.setAttribute("position", new BufferAttribute(new Float32Array(lineSegmentsPositions.flat()), 3));
    this.lineSegments.geometry.attributes.position.needsUpdate = true;
  }
}

/**
 * Seen from top The geometry we construct look like this.
 * Each face consist of two triangles making up that face.
 *
 *  x0y1.........x1y1
 *  .           .   .
 *  .        .      .
 *  .     .         .
 *  .  .            .
 *  x0y0.........x1y0
 *
 * */
export function getBoxGeometry(x0: number, y0: number, y1: number, x1: number, height: number) {
  const positions: [number, number, number][] = [];
  // Bottom face
  positions.push(
    [x0, y0, 0],
    [x0, y1, 0],
    [x1, y1, 0],

    [x0, y0, 0],
    [x1, y1, 0],
    [x1, y0, 0]
  );

  // Top face
  positions.push(
    [x0, y0, height],
    [x1, y1, height],
    [x0, y1, height],

    [x0, y0, height],
    [x1, y0, height],
    [x1, y1, height]
  );

  // Front face
  positions.push(
    [x0, y0, 0],
    [x1, y0, 0],
    [x1, y0, height],

    [x0, y0, 0],
    [x1, y0, height],
    [x0, y0, height]
  );

  // Left face
  /**
   * Add your code here!
   */

  // Right face
  positions.push(
    [x1, y1, 0],
    [x1, y1, height],
    [x1, y0, 0],

    [x1, y0, 0],
    [x1, y1, height],
    [x1, y0, height]
  );

  // Back face
  positions.push(
    [x0, y1, 0],
    [x1, y1, height],
    [x1, y1, 0],

    [x0, y1, 0],
    [x0, y1, height],
    [x1, y1, height]
  );

  return positions;
}

function getLineSegments(x0: number, y0: number, y1: number, x1: number, height: number) {
  const positions: [number, number, number][] = [];

  for (let z = 0; z <= height; z += CELL_SIZE.z) {
    // Front
    positions.push([x0, y0, z], [x1, y0, z]);
    // Right
    positions.push([x0, y0, z], [x0, y1, z]);
    // Left
    positions.push([x1, y0, z], [x1, y1, z]);
    // Back
    positions.push([x0, y1, z], [x1, y1, z]);
  }
  return positions;
}
