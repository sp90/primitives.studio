import { DirectionalLight, HemisphereLight } from "three";

export function baseHemiLight(
  skyColor = 0xffffff,
  groundColor = 0xffffff,
  intensity = 0.8
) {
  const hemiLight = new HemisphereLight(skyColor, groundColor, intensity);
  hemiLight.color.setHSL(0.6, 0.75, 0.5);
  hemiLight.groundColor.setHSL(0.095, 0.5, 0.5);
  hemiLight.position.set(0, 500, 0);

  return hemiLight;
}

export function baseDirLight(color = 0xffffff, intensity = 1) {
  const dirLight = new DirectionalLight(color, intensity);

  dirLight.position.set(-1, 0.75, 1);
  dirLight.position.multiplyScalar(5);
  dirLight.intensity = 0.4;
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  const d = 25;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 15000;

  return dirLight;
}

export function baseSunLight() {
  return {
    dirLight: baseDirLight(),
    hemiLight: baseHemiLight(),
  };
}
