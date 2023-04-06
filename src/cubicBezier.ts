import { EasingFunc } from "./easing";

export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): EasingFunc {
  return (t) => {
    if (x1 == y1 && x2 == y2) return t; // Linear
    const x = solveForT(t, x1, x2);
    return calcBezier(x, y1, y2);
  };
}

function calcBezier(t: number, a: number, b: number) {
  const u = 1 - t;
  return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
}

function calcDerivative(t: number, a: number, b: number) {
  const u = 1 - t;
  return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b);
}

function solveForT(x: number, a: number, b: number) {
  let t = x;
  for (let i = 0; i < 5; i++) {
    const x2 = calcBezier(t, a, b);
    const dx = calcDerivative(t, a, b);
    if (dx == 0) return t;
    t -= (x2 - x) / dx; // Newton–Raphson
  }
  return t;
}
