export type EasingFunc = (t: number) => number;

const BACK = {
  strength: 1.525,
};

const BOUNCE = {
  t1: 4 / 11,
  t2: 8 / 11,
  t3: 9 / 10,
  a: 4356 / 361,
  b: 35442 / 1805,
  c: 16061 / 1805,
};

const { sin, cos, PI, sqrt, pow } = Math;

export const Easing = Object.freeze({
  Linear: (t: number) => t,
  Quad: buildTriple((t) => t * t),
  Cubic: buildTriple((t) => t * t * t),
  Quart: buildTriple((t) => t * t * t * t),
  Quint: buildTriple((t) => t * t * t * t * t),
  Sine: buildTriple((t) => 1 - cos((t * PI) / 2)),
  Expo: buildTriple((t) => (t === 0 ? 0 : pow(1024, t - 1))),
  Circ: buildTriple((t) => 1 - sqrt(1 - t * t)),
  Elastic: buildTriple((t) => (t === 0 ? 0 : -pow(1024, t - 1) * sin((t - 1.1) * 5 * PI))),
  Back: buildTriple((t) => t * t * ((BACK.strength + 1) * t - BACK.strength)),
  Bounce: buildTriple((t) => {
    if (t === 1 || t === 0) return t;
    return t < BOUNCE.t1
      ? 7.5625 * t * t
      : t < BOUNCE.t2
      ? 9.075 * t * t - 9.9 * t + 3.4
      : t < BOUNCE.t3
      ? BOUNCE.a * t * t - BOUNCE.b * t + BOUNCE.c
      : 10.8 * t * t - 20.52 * t + 10.72;
  }, true),
});

export function reversedEasing(easing: EasingFunc): EasingFunc {
  return (t) => 1 - easing(1 - t);
}

export function mirroredEasing(easing: EasingFunc): EasingFunc {
  return (t) => (t < 0.5 ? easing(2 * t) * 0.5 : 1 - easing(2 * (1 - t)) * 0.5);
}

function buildTriple(easing: EasingFunc, reversed = false) {
  const [easeIn, easeOut] = reversed ? [reversedEasing(easing), easing] : [easing, reversedEasing(easing)];
  return {
    In: easeIn,
    Out: easeOut,
    InOut: mirroredEasing(easeIn),
  };
}
