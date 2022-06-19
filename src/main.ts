import { WebGLRenderer } from "three";
import { CamerasState } from "./camera";
import { Renderer } from "./renderer";
import { SceneState } from "./scene";
import "./style.css";

class Main {
  canvas = document.querySelector<HTMLCanvasElement>(
    "#webgl"
  ) as HTMLCanvasElement;
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  aspectRatio = this.sizes.width / this.sizes.height;
  sceneState = new SceneState();
  camerasState = new CamerasState();
  renderer: Renderer = new Renderer(
    this.sceneState.mainScene,
    this.canvas,
    this.camerasState.mainCamera
  );

  constructor() {
    const _self = this;

    this.sceneState.addBaseScene(this.camerasState.mainCamera);
    this.renderer.initSceneRenderer((renderer: WebGLRenderer) => {
      const tick = () => {
        renderer.render(
          _self.sceneState.mainScene,
          _self.camerasState.mainCamera
        );

        window.requestAnimationFrame(tick);
      };

      tick();
    });
  }
}

new Main();
