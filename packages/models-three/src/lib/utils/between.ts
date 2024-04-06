export function between(min: number, max: number) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)));
}
