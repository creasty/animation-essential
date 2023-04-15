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
 * @param {number} t - The interpolation factor between 0 and 1.
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
 * Linearly interpolates between two consecutive values in the points given in array.
 *
 * @param {number[]} points - The array of points. Must have at least two elements.
 * @param {number} t - The interpolation factor between 0 and [the number of points] - 1.
 * @returns {number} The interpolated value.
 */
export function multiPointLerp(points: number[], t: number): number {
  const l = points.length;
  if (l < 2) throw new TypeError("multiPointLerp requires at least two points");

  t = clamp(t, 0, l - 1);
  const intPart = Math.floor(t);
  const fracPart = t - intPart;
  return lerp(points[intPart], points[Math.min(intPart + 1, l - 1)], fracPart);
}

/**
 * Combines the integer part of an input value with the result of applying a mix function to its fractional part.
 * It comes in very handy when used with {@link multiPointLerp}.
 *
 * @param {number} v - The input value.
 * @param {function} mix - The mix function.
 * @returns {number} The mixed value.
 */
export function fractionalMix(v: number, mix: (t: number) => number): number {
  const intPart = Math.floor(v);
  const fracPart = v - intPart;
  return intPart + mix(fracPart);
}
