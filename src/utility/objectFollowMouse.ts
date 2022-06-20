import { Body, Sphere, Vec3 } from "cannon-es";
import {
  Camera,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  Raycaster,
  SphereGeometry,
  Vector2,
} from "three";

export const objectFollowMouse = (
  camera: Camera,
  plane: Object3D,
  radius = 1
) => {
  const raycaster = new Raycaster();
  const shape = new Sphere(radius);
  const geometry = new SphereGeometry(radius);
  const material = new MeshLambertMaterial({ color: 0xff0000 });

  const objectBody = new Body({ mass: 1, type: Body.STATIC });
  const object = new Mesh(geometry, material);
  object.castShadow = true;

  objectBody.addShape(shape);
  objectBody.position.set(0, 0.5, 0);

  window.addEventListener("mousemove", (e) => {
    const pointer = new Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);

    // // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects([plane]);

    let i = intersects.length;

    while (i--) {
      if (intersects[i]) {
        const toPos = new Vec3().copy(intersects[i].point as any);

        objectBody.position.x = toPos.x;
        objectBody.position.z = toPos.z;
      }

      if (i <= 0) {
        break;
      }
    }
  });

  return {
    objectBody,
    object,
  };
};
