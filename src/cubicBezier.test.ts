import { cubicBezier } from "./cubicBezier";
import { Easing } from "./easing";

const ts = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

describe("cubicBezier", () => {
  test("emulates Easing.Linear", () => {
    const fn = cubicBezier(0, 0, 1, 1);
    ts.forEach((t) => {
      expect(fn(t)).toEqual(Easing.Linear(t));
    });
  });

  test("emulates Easing.Sine.In", () => {
    const fn = cubicBezier(0.12, 0, 0.39, 0);
    ts.forEach((t) => {
      expect(Math.abs(fn(t) - Easing.Sine.In(t))).toBeLessThan(0.1);
    });
  });

  test("emulates Easing.Quart.Out", () => {
    const fn = cubicBezier(0.25, 1, 0.5, 1);
    ts.forEach((t) => {
      expect(Math.abs(fn(t) - Easing.Quart.Out(t))).toBeLessThan(0.1);
    });
  });

  test("emulates Easing.Expo.InOut", () => {
    const fn = cubicBezier(0.87, 0, 0.13, 1);
    ts.forEach((t) => {
      expect(Math.abs(fn(t) - Easing.Expo.InOut(t))).toBeLessThan(0.1);
    });
  });

  test("emulates Easing.Back.InOut", () => {
    const fn = cubicBezier(0.68, -0.6, 0.32, 1.6);
    ts.forEach((t) => {
      expect(Math.abs(fn(t) - Easing.Back.InOut(t))).toBeLessThan(0.1);
    });
  });
});
