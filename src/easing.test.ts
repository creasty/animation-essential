import { Easing, mirroredEasing, reversedEasing } from "./easing";

const ts = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

describe("reversedEasing", () => {
  test("returns a reversed function", () => {
    const fn = reversedEasing((t) => t * 0.5);
    expect(ts.map(fn)).toMatchInlineSnapshot(`
      [
        0.5,
        0.55,
        0.6,
        0.65,
        0.7,
        0.75,
        0.8,
        0.85,
        0.9,
        0.95,
        1,
      ]
    `);
  });
});

describe("mirroredEasing", () => {
  test("returns a mirrored function", () => {
    const fn = mirroredEasing((t) => t * 0.5);
    expect(ts.map(fn)).toMatchInlineSnapshot(`
      [
        0,
        0.05,
        0.1,
        0.15,
        0.2,
        0.75,
        0.8,
        0.85,
        0.9,
        0.95,
        1,
      ]
    `);
  });
});

describe("Easing", () => {
  const nonLinearFunctions: [Exclude<keyof typeof Easing, "Linear">, "In" | "Out" | "InOut"][] = [
    "Quad",
    "Cubic",
    "Quart",
    "Quint",
    "Sine",
    "Expo",
    "Circ",
    "Elastic",
    "Back",
    "Bounce",
  ].flatMap((name) => ["In", "Out", "InOut"].map((curveType) => [name, curveType])) as any;

  test("Linear being an identity function", () => {
    expect(ts.map(Easing.Linear)).toEqual(ts);
  });

  test.each(nonLinearFunctions)("%s.%s works", (name, curveType) => {
    const fn = Easing[name][curveType];
    expect(ts.map(fn)).toMatchSnapshot();
  });
});
