export function clamp(v: number, min: number, max: number) {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothStep(a: number, b: number, x: number) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

export function steppingMix(v: number, mix: (t: number) => number) {
  const s = Math.floor(v);
  return s + mix(v - s);
}
