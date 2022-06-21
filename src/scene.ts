import { Body, Box, Plane, Vec3, World } from "cannon-es";
import {
  BoxBufferGeometry,
  BoxGeometry,
  Color,
  Euler,
  Fog,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
} from "three";
import { ShapeType, threeToCannon } from "three-to-cannon";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { baseDirLight, baseHemiLight } from "./utility/lights";
import { objectFollowMouse } from "./utility/objectFollowMouse";

import roomGlbUrl from "./assets/room.glb?url";

interface ObjectPairs {
  object: Object3D;
  body?: Body;
}

export class SceneState {
  private boxes = 40;
  private objectPairs: ObjectPairs[] = [];

  loader = new GLTFLoader();
  mainScene = new Scene();
  mainWorld = new World({
    gravity: new Vec3(0, -10, 0),
  });

  constructor() {}

  addToScene(object: Object3D, objectBody?: Body, ignoreOnTicks = false) {
    let objectPair: ObjectPairs = {
      object,
    };

    this.mainScene.add(object);

    if (objectBody) {
      objectPair.body = objectBody;
      this.mainWorld.addBody(objectBody);
    }

    !!!ignoreOnTicks && this.objectPairs.push(objectPair);
  }

  addBaseScene(mainCamera: PerspectiveCamera) {
    this.mainScene.background = new Color(0x3333ff);
    this.mainScene.fog = new Fog(0x000000, 500, 10000);

    this.addToScene(mainCamera);
    this.addBoxes();

    this.mainScene.add(baseHemiLight());
    this.mainScene.add(baseDirLight());

    const { ground } = this.addBasePlane();

    const { object, objectBody } = objectFollowMouse(mainCamera, ground);

    this.addToScene(object, objectBody);
    this.loadObj(roomGlbUrl);

    this.addWall();
  }

  updatePhyisics() {
    if (this.objectPairs?.length) {
      let i = this.objectPairs.length;

      while (i--) {
        const objectPair = this.objectPairs[i];

        if (objectPair.body) {
          objectPair.object.position.copy(objectPair.body.position as any);
          objectPair.object.quaternion.copy(objectPair.body.quaternion as any);
        }

        if (i <= 0) break;
      }
    }
  }

  private loadObj(url: string) {
    const _self = this;
    _self.loader.load(
      url,
      (gltf) => {
        _self.mainScene.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

        gltf.scene.position.set(-2, 0.1, -2);
        gltf.scene.scale.set(1.8, 1.8, 1.8);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      }
    );
  }

  private addWall() {
    const geometry = new BoxGeometry(5, 3, 0.5);
    const material = new MeshLambertMaterial({ color: 0xff0000 });
    const object = new Mesh(geometry, material);
    object.castShadow = true;

    object.quaternion.setFromEuler(new Euler(0, -Math.PI / 2, 0));
    const result = threeToCannon(object, { type: ShapeType.BOX });
    const objectBody = new Body({ mass: 1 });

    if (result) {
      objectBody.addShape(result.shape, result.offset, result.orientation);
    }

    this.addToScene(object, objectBody);
  }

  private addBoxes() {
    const boxShape = new Box(new Vec3(0.5, 0.5, 0.5));
    const cubeGeometry = new BoxBufferGeometry(1, 1, 1, 10, 10);
    const cubeMaterial = new MeshPhongMaterial({ color: 0x888888 });

    let i = this.boxes;

    while (i--) {
      const boxBody = new Body({ mass: 1 });
      const box = new Mesh(cubeGeometry, cubeMaterial);
      box.castShadow = true;

      boxBody.addShape(boxShape);
      boxBody.position.set(
        Math.random() - 0.5,
        (i + 1) * 2.5 + 0.5,
        Math.random() - 0.5
      );

      this.addToScene(box, boxBody);

      if (i <= 0) break;
    }
  }

  private addBasePlane() {
    const groundShape = new Plane();
    const groundBody = new Body({ mass: 0 });
    const groundMaterial = new MeshStandardMaterial({ color: "0x999999" });
    const groundGeometry = new PlaneGeometry(100, 100, 100, 100);
    const ground = new Mesh(groundGeometry, groundMaterial);

    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    ground.position.copy(groundBody.position as any);
    ground.quaternion.copy(groundBody.quaternion as any);
    ground.receiveShadow = true;
    ground.userData = {
      isFloor: true,
    };

    this.addToScene(ground, groundBody, true);

    return {
      ground,
      groundBody,
    };
  }
}
