import { between } from '../utils';
import { Model } from '../core';

export class Cloud extends Model {
  constructor() {
    super('models/cloud.glb');
    this.onLoad = (scene) => {
      const x = between(0, 90);
      const z = between(-10, 120);
      scene.position.set(x, 10, z);
      this.scale.set(50, 50, 50);
    };
  }
}
