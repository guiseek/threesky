import type { Sky } from 'three/examples/jsm/Addons';
import type { RenderTarget } from 'three';

export abstract class Horizon {
  abstract sky: Sky;

  abstract updateSun(renderTarget: RenderTarget): void;
}
