/**
 * Clamps a value to be within a given range.
 *
 * @param {number} v - The value to clamp.
 * @param {number} min - The minimum value in the range.
 * @param {number} max - The maximum value in the range.
 * @returns {number} The clamped value.
 */
export function clamp(v: number, min: number, max: number): number {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

/**
 * Linearly interpolates between two values.
 *
 * @param {number} a - The first value.
 * @param {number} b - The second value.
 * @param {number} t - The interpolation factor.
 * @returns {number} The interpolated value.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Calculates a smooth step function with an easing effect.
 *
 * @param {number} a - The lower bound of the smooth step function.
 * @param {number} b - The upper bound of the smooth step function.
 * @param {number} x - The input value to the smooth step function.
 * @returns {number} The smoothed output value between 0 and 1.
 */
export function smoothStep(a: number, b: number, x: number): number {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Combines the integer part of an input value with the result of applying a mix function to its decimal part.
 *
 * @param {number} v - The input value.
 * @param {function} mix - The mix function.
 * @returns {number} The mixed value.
 */
export function steppingMix(v: number, mix: (t: number) => number): number {
  const s = Math.floor(v);
  return s + mix(v - s);
}
