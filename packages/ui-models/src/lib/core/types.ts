export type Direction = "n" | "w" | "s" | "e";

export type Key =
  | "W"
  | "Q"
  | "E"
  | "A"
  | "S"
  | "D"
  | "Up"
  | "Left"
  | "Down"
  | "Right"
  | "Space"
  | "ShiftLeft"
  | "ControlLeft"
  | "Escape";

export interface KeyDownCallback {
  (key: Key): void;
}
