import { Model, type Updatable } from "../core";
import { Vector3 } from "three";

export class Missile extends Model implements Updatable {
  readonly speed = 4;

  constructor(readonly direction: Vector3) {
    super("models/missile.glb");
    this.scale.set(1.6, 1.6, 1.6);
  }

  update() {
    this.position.addScaledVector(this.direction, this.speed);
  }
}
