import type { Direction, Key, KeyDownCallback } from "./types";
import { Quaternion } from "three";

export class Control {
  readonly key = {
    W: 0,
    Q: 0,
    E: 0,
    A: 0,
    S: 0,
    D: 0,
    Up: 0,
    Left: 0,
    Down: 0,
    Right: 0,
    Space: 0,
    ShiftLeft: 0,
    ControlLeft: 0,
    Escape: 0,
  };

  readonly direction = {
    North: 0,
    West: 0,
    South: 0,
    East: 0,
    Some: 0,
  };

  directions = new Set<Direction>();

  get #arrowKeys() {
    return [
      this.key.A,
      this.key.S,
      this.key.D,
      this.key.W,
      this.key.Left,
      this.key.Down,
      this.key.Right,
      this.key.Up,
    ];
  }

  #touched = false;

  get touched() {
    return this.#touched;
  }

  #onTouched: KeyDownCallback[] = [];
  set onTouched(fn: KeyDownCallback) {
    this.#onTouched.push(fn);
  }

  #onKeyDown: KeyDownCallback[] = [];
  set onKeyDown(fn: KeyDownCallback) {
    this.#onKeyDown.push(fn);
  }

  #onKeyUp: KeyDownCallback[] = [];
  set onKeyUp(fn: KeyDownCallback) {
    this.#onKeyUp.push(fn);
  }

  readonly deviceRotation = new Quaternion();
  #onRotation: ((value: Quaternion) => void)[] = [];
  set onRotation(cb: (value: Quaternion) => void) {
    this.#onRotation.push(cb);
  }

  // readonly deviceOrientation;
  #onOrientation: ((value: DeviceOrientationEvent) => void)[] = [];
  set onOrientation(cb: (value: DeviceOrientationEvent) => void) {
    this.#onOrientation.push(cb);
  }

  initialize() {
    onkeydown = this.#onKeyDownEvent;
    onkeyup = this.#onKeyUpEvent;
  }

  update() {
    if (this.key.W || this.key.Up) {
      this.direction.North = 1;
      this.directions.add("n");
    } else {
      this.direction.North = 0;
      this.directions.delete("n");
    }

    if (this.key.A || this.key.Left) {
      this.direction.West = 1;
      this.directions.add("w");
    } else {
      this.direction.West = 0;
      this.directions.delete("w");
    }

    if (this.key.S || this.key.Down) {
      this.direction.South = 1;
      this.directions.add("s");
    } else {
      this.direction.South = 0;
      this.directions.delete("s");
    }

    if (this.key.D || this.key.Right) {
      this.direction.East = 1;
      this.directions.add("e");
    } else {
      this.direction.East = 0;
      this.directions.delete("e");
    }

    if (Math.max(...this.#arrowKeys)) {
      this.direction.Some = 1;
    } else {
      this.direction.Some = 0;
    }
  }

  #onKeyDownEvent = ({ code }: KeyboardEvent) => {
    if (this.#validateKeyCode(code)) {
      this.#setCodeToKeyValue(code, 1);

      for (const fn of this.#onKeyDown) fn(code);
    }
  };

  #onKeyUpEvent = ({ code }: KeyboardEvent) => {
    if (this.#validateKeyCode(code)) {
      if (!this.#touched) {
        for (const fn of this.#onTouched) fn(code);
        this.#touched = true;
      }

      this.#setCodeToKeyValue(code, 0);

      for (const fn of this.#onKeyUp) fn(code);
    }
  };

  #setCodeToKeyValue(code: string, value: number) {
    this.key[this.#formatKey(code)] = value;
  }

  #validateKeyCode(code: string): code is Key {
    const key = this.#formatKey(code);
    return Object.keys(this.key).includes(key);
  }

  #formatKey(code: string) {
    type Key = keyof typeof this.key;
    return code.replace("Key", "").replace("Arrow", "") as Key;
  }
}
