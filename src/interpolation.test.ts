import { clamp, lerp, smoothStep, steppingMix } from "./interpolation";

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

describe("steppingMix", () => {
  test.each([
    [0.0, 1.0],
    [0.1, 0.9],
    [0.2, 0.8],
    [0.8, 0.2],
    [0.9, 0.1],
    [1.0, 2.0],
    [1.1, 1.9],
    [1.2, 1.8],
    [1.8, 1.2],
    [1.9, 1.1],
    [2.0, 3.0],
    [2.1, 2.9],
    [2.2, 2.8],
    [2.8, 2.2],
    [2.9, 2.1],
  ])("steppingMix(%f, (t) => 1 - t) returns %f", (v, expected) => {
    expect(steppingMix(v, (t) => 1 - t)).toBeCloseTo(expected);
  });
});
