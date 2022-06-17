import "./style.css";
import {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import handleResize from "./helpers/handleResize";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let aspectRatio = sizes.width / sizes.height;

const canvas = document.querySelector<HTMLDivElement>("#webgl")!;
const scene = new Scene();

const mesh = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({ color: "#ff0000" })
);

const camera = new PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
const axesHelper = new AxesHelper();

camera.position.set(3, 3, 3);
camera.lookAt(mesh.position);

scene.add(camera);
scene.add(axesHelper);
scene.add(mesh);

const renderer = new WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

handleResize(sizes, aspectRatio, camera, renderer);
