import { World } from "cannon-es";
import {
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from "three";
import { DEFAULT_CAMERA_OPTIONS } from "./camera";
import { SceneState } from "./scene";

export class Renderer {
  private timeStep = 1 / 60;
  private scene: Scene;
  private world: World;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;

  constructor(
    sceneState: SceneState,
    canvas: HTMLCanvasElement,
    camera: PerspectiveCamera
  ) {
    this.scene = sceneState.mainScene;
    this.world = sceneState.mainWorld;
    this.camera = camera;
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
    });
  }

  init(cb?: Function) {
    this.baseRendererSettings(this.renderer);
    this.handleResize(this.renderer);

    cb && this.startAnimationTicks(cb);

    return this.renderer;
  }

  private startAnimationTicks(cb: Function) {
    const tick = () => {
      this.renderer.render(this.scene, this.camera);
      this.world.fixedStep(this.timeStep);

      cb(this.renderer);

      window.requestAnimationFrame(tick);
    };

    tick();
  }

  private baseRendererSettings(renderer: WebGLRenderer) {
    renderer.setSize(
      DEFAULT_CAMERA_OPTIONS.width,
      DEFAULT_CAMERA_OPTIONS.height
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.scene?.fog && renderer.setClearColor(this.scene.fog.color);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.outputEncoding = sRGBEncoding;
    renderer.render(this.scene, this.camera);
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
