import * as THREE from "three";
import { Renderer, WebGLRenderer } from "three";

const rendererWidth = window.innerWidth;
const rendererHeight = window.innerHeight;
const clearColor = 0xaaaaff;

/*
 * TASK 1: Creating a renderer
 * Create a new WebGLRenderer, and make sure you pass it the canvas.
 * On the renderer, define a size and set a clear color (aka background color) according to what we have defined above.

 * If you want to turn on the possibility for some cool shadows as well, call the function we have provided below.
 */
export function setupRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

  renderer.setSize(rendererWidth, rendererHeight);
  renderer.setClearColor(clearColor);
  addCoolShadows(renderer);
  return renderer;
}

function addCoolShadows(renderer: WebGLRenderer) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}
