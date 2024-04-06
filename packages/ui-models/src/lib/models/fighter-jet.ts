import { Model, type Control, type Updatable } from "../core";
import { MathUtils, Vector3, type Scene } from "three";
import { Missile } from "./missile";
import { math } from "../utils";

const MAX_YAW_ACCELERATION = 0.001;

const MAX_MISSILE_DISTANCE = 500;

export class FighterJet extends Model implements Updatable {
  #maxSpeed = 4;
  #acceleration = 0.6;

  #yawVelocity = 0;
  #pitchVelocity = 0;
  #rollVelocity = 0;

  #planeSpeed = 0.06;
  #maxVelocity = 0.8;
  #friction = 0.96;

  #missiles = new Set<Missile>();

  constructor(private control: Control, private scene: Scene) {
    super("models/fighter-jet.glb");
    this.onLoad = (scene) => {
      scene.position.set(0, 0, 0);
    };

    this.control.onKeyDown = (code) => {
      if (code === "Space") {
        this.scene.add(this.fire());
      }
    };
  }

  fire() {
    const missile = new Missile(this.#direction);
    missile.position.copy(this.position);
    missile.quaternion.copy(this.quaternion);
    this.#missiles.add(missile);
    return missile;
  }

  get #direction() {
    return this.getWorldDirection(new Vector3(0, 0, 1));
  }

  #toForward(speed = 0) {
    const currentSpeed = Math.min(speed + this.#acceleration, this.#maxSpeed);
    const direction = new Vector3(0, 0, -1).applyQuaternion(this.quaternion);
    this.position.addScaledVector(direction, -currentSpeed);
  }

  #handleInput(yawAcceleration: number) {
    if (this.control.key.E) {
      this.#yawVelocity -= yawAcceleration;
    }
    if (this.control.key.Q) {
      this.#yawVelocity += yawAcceleration;
    }

    if (this.control.key.A || this.control.key.Left) {
      this.#rollVelocity -= this.#acceleration / 500;
    }
    if (this.control.key.D || this.control.key.Right) {
      this.#rollVelocity += this.#acceleration / 500;
    }

    if (this.control.key.W || this.control.key.Up) {
      this.#pitchVelocity += this.#acceleration / 500;
    }
    if (this.control.key.S || this.control.key.Down) {
      this.#pitchVelocity -= this.#acceleration / 500;
    }
  }

  update() {
    this.#yawVelocity *= this.#friction;
    this.#pitchVelocity *= this.#friction;
    this.#rollVelocity *= this.#friction;

    for (const missile of this.#missiles) {
      missile.update();
      const distance = missile.position.distanceTo(this.position);
      if (distance > MAX_MISSILE_DISTANCE) {
        this.#missiles.delete(missile);
        this.scene.remove(missile);
      }
    }

    const yawAcceleration = MathUtils.clamp(
      MathUtils.lerp(
        0.0001,
        this.#acceleration,
        Math.abs(this.#planeSpeed) / this.#maxVelocity
      ),
      0.0001,
      MAX_YAW_ACCELERATION
    );

    this.#handleInput(yawAcceleration);

    this.#toForward(
      this.#planeSpeed * this.control.key.ShiftLeft
        ? this.#acceleration * 10
        : 1
    );

    this.#yawVelocity = math.clamp(
      this.#yawVelocity,
      -this.#maxVelocity,
      this.#maxVelocity
    );
    this.#pitchVelocity = math.clamp(
      this.#pitchVelocity,
      -this.#maxVelocity,
      this.#maxVelocity
    );
    this.#rollVelocity = math.clamp(
      this.#rollVelocity,
      -this.#maxVelocity,
      this.#maxVelocity
    );

    this.rotateY(this.#yawVelocity);
    this.rotateX(this.#pitchVelocity);
    this.rotateZ(this.#rollVelocity);

    this.rotation.z += this.#rollVelocity;
    this.position.x += this.#planeSpeed * 1;
  }
}
