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
    this.sceneState,
    this.canvas,
    this.camerasState.mainCamera
  );

  constructor() {
    this.sceneState.addBaseScene(this.camerasState.mainCamera);
    this.renderer.init(() => {
      this.sceneState.updatePhyisics();
    });

    this.camerasState.mainCamera.position.set(8, 12, 8);
    this.camerasState.mainCamera.lookAt(-3, 0, -3);

    // const controls = new OrbitControls(
    //   this.camerasState.mainCamera,
    //   renderer.domElement
    // );

    // controls.enableDamping = true;
    // controls.enablePan = true;
    // controls.dampingFactor = 0.3;
    // controls.minDistance = 10;
    // controls.maxDistance = 500;
  }
}

new Main();
