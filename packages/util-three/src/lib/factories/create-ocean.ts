import { Water } from 'three/examples/jsm/Addons.js';
import {
  Vector3,
  PlaneGeometry,
  RepeatWrapping,
  TextureLoader,
  type Texture,
} from 'three';

export function createOcean(hasFog = false, far = 100000) {
  const geometry = new PlaneGeometry(far, far);

  const pathTexture = 'assets/textures/waternormals.jpg';
  const wrapTexture = (texture: Texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
  };
  const loader = new TextureLoader();
  const normals = loader.load(pathTexture, wrapTexture);

  const water = new Water(geometry, {
    textureWidth: 512,
    textureHeight: 512,
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    sunDirection: new Vector3(),
    waterNormals: normals,
    fog: hasFog,
  });

  water.rotation.x = -Math.PI / 2;

  return { water };
}
