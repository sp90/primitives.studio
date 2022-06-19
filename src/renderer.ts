import {
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { DEFAULT_CAMERA_OPTIONS } from "./camera";

export class Renderer {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;

  constructor(
    scene: Scene,
    canvas: HTMLCanvasElement,
    camera: PerspectiveCamera
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = new WebGLRenderer({
      canvas,
    });
  }

  initSceneRenderer(animationTick: Function) {
    this.baseRendererSettings(this.renderer);
    this.handleResize(this.renderer);

    animationTick(this.renderer);

    return this.renderer;
  }

  private baseRendererSettings(renderer: WebGLRenderer) {
    renderer.setSize(
      DEFAULT_CAMERA_OPTIONS.width,
      DEFAULT_CAMERA_OPTIONS.height
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.render(this.scene, this.camera);

    console.log("hello");
  }

  private handleResize(renderer: WebGLRenderer) {
    const camera = this.camera;

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }
}
