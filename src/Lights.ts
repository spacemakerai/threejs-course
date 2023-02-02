import { AmbientLight, CameraHelper, DirectionalLight, Object3D } from "three";
import { CELL_WIDTH_DEPTH, GRID_DEPTH, GRID_WIDTH } from "./Grid";
import { center } from "./main";

export default class Lights extends Object3D {
  constructor() {
    super();
    this.add(this.directionalLight());
    this.add(this.ambientLight());
  }

  directionalLight() {
    const dirLight = new DirectionalLight(0xffffff, 0.7);

    dirLight.castShadow = true;
    dirLight.position.set(30, 30, 100);

    dirLight.shadow.camera.left = (-CELL_WIDTH_DEPTH * GRID_WIDTH) / 2;
    dirLight.shadow.camera.right = (CELL_WIDTH_DEPTH * GRID_WIDTH) / 2;
    dirLight.shadow.camera.top = (-CELL_WIDTH_DEPTH * GRID_DEPTH) / 2;
    dirLight.shadow.camera.bottom = (CELL_WIDTH_DEPTH * GRID_DEPTH) / 2;

    dirLight.shadow.camera.lookAt(center.x, center.y, 0);

    const helper = new CameraHelper(dirLight.shadow.camera);
    dirLight.add(helper);

    return dirLight;
  }

  ambientLight() {
    return new AmbientLight(0xffffff, 0.4);
  }
}
