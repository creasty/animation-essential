import { clamp, lerp, smoothStep, fractionalMix, multiPointLerp } from "./interpolation";

function generateArray(start: number, end: number, step: number) {
  const result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

describe("clamp", () => {
  test("clamps a value between a min and max", () => {
    expect(clamp(-1000, 1, 9)).toBe(1);
    expect(clamp(0, 1, 9)).toBe(1);
    expect(clamp(1, 1, 9)).toBe(1);
    expect(clamp(2, 1, 9)).toBe(2);
    expect(clamp(8, 1, 9)).toBe(8);
    expect(clamp(9, 1, 9)).toBe(9);
    expect(clamp(1000, 1, 9)).toBe(9);
  });
});

describe("lerp", () => {
  test("interpolates a value between two points", () => {
    expect(lerp(1, 9, 0)).toBe(1);
    expect(lerp(1, 9, 0.25)).toBe(3);
    expect(lerp(1, 9, 0.5)).toBe(5);
    expect(lerp(1, 9, 0.75)).toBe(7);
    expect(lerp(1, 9, 1)).toBe(9);
  });
});

describe("smoothStep", () => {
  test.each([
    [0, 1, -1, 0],
    [0, 1, 0, 0],
    [0, 1, 0.5, 0.5],
    [0, 1, 1, 1],
    [0, 1, 2, 1],
    [-1, 1, -2, 0],
    [-1, 1, -1, 0],
    [-1, 1, 0, 0.5],
    [-1, 1, 1, 1],
    [-1, 1, 2, 1],
    [2, 4, 1, 0],
    [2, 4, 2, 0],
    [2, 4, 3, 0.5],
    [2, 4, 4, 1],
    [2, 4, 5, 1],
  ])("smoothStep(%f, %f, %f) returns %f", (a, b, x, expected) => {
    expect(smoothStep(a, b, x)).toBeCloseTo(expected);
  });
});

describe("multiPointLerp", () => {
  test("requires at least two points", () => {
    expect(() => {
      multiPointLerp([], 0);
    }).toThrowError(TypeError);
    expect(() => {
      multiPointLerp([0], 0);
    }).toThrowError(TypeError);
    expect(() => {
      multiPointLerp([0, 1], 0);
    }).not.toThrowError(TypeError);
  });

  test("interpolates between two values", () => {
    const ts = generateArray(0, 1, 0.1);
    const points = [1, 9];
    expect(ts.map((t) => multiPointLerp(points, t))).toMatchSnapshot();
  });

  test("interpolates between two consecutive values in multiple points", () => {
    const ts = generateArray(0, 3, 0.1);
    const points = [1, 20, 300, 4000];
    expect(ts.map((t) => multiPointLerp(points, t))).toMatchSnapshot();
  });
});

describe("fractionalMix", () => {
  test("applies the mix function only to the fractional part of input", () => {
    const values = generateArray(0, 3, 0.1);
    const mixFunc = (t: number) => t * t;
    expect(values.map((v) => fractionalMix(v, mixFunc))).toMatchSnapshot();
  });
});
