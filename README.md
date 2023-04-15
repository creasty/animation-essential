# animation-essential

[![npm version](https://badge.fury.io/js/animation-essential.svg)](https://www.npmjs.com/package/animation-essential) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`animation-essential` is a lightweight and modern animation library designed to simplify your animation needs. The library features an intuitive and easy-to-use API that allows you to create smooth and fluid animations effortlessly.

It is highly flexible and can be integrated with any library or framework of your choice such as [three.js](https://github.com/mrdoob/three.js).

## Core Principles

- **TypeScript-first experience**: Provides a well-typed interface that makes it easy to use and work with.
- **Platform-agnostic**: Designed to work on both the browser and server, without any dependencies on the DOM or browser-only APIs.
- **Focus on fundamental animation properties**: Representing time and the amount of changes in animated objects with numbers and numbers only.
- **Separation of clock management**: Allows you to full control over when and how animation should progress.

## Installation

Getting started with animation-essential is a breeze. You can install the library using the npm package manager:

```sh
npm i animation-essential
```

## What's included

### Interpolation

The interpolation module provides a set of functions that can be used to calculate and manipulate values smoothly. The available functions include:

- `clamp`: Clamps a value to be within a given range.
- `lerp`: Linearly interpolates between two values.
- `smoothStep`: Calculates a smooth step function with an easing effect.
- `steppingMix`: Combines the integer part of an input value with the result of applying a mix function to its decimal part.

```typescript
import { clamp, lerp, smoothStep, steppingMix } from "animation-essential";

clamp(1.5, 0, 1); // Returns 1
lerp(0, 100, 0.5); // Returns 50
smoothStep(0, 1, 0.5); // Returns 0.5
steppingMix(2.5, (t) => t * t); // Returns 2.25
```

### Easing

Easing functions are predefined so that can be used to apply various easing effects to your animations. The available preset are:

- `Easing.Linear`
- `Easing.Quad.In`
- `Easing.Quad.Out`
- `Easing.Quad.InOut`
- `Easing.Cubic.In`
- `Easing.Cubic.Out`
- `Easing.Cubic.InOut`
- `Easing.Quart.In`
- `Easing.Quart.Out`
- `Easing.Quart.InOut`
- `Easing.Quint.In`
- `Easing.Quint.Out`
- `Easing.Quint.InOut`
- `Easing.Sine.In`
- `Easing.Sine.Out`
- `Easing.Sine.InOut`
- `Easing.Expo.In`
- `Easing.Expo.Out`
- `Easing.Expo.InOut`
- `Easing.Circ.In`
- `Easing.Circ.Out`
- `Easing.Circ.InOut`
- `Easing.Elastic.In`
- `Easing.Elastic.Out`
- `Easing.Elastic.InOut`
- `Easing.Back.In`
- `Easing.Back.Out`
- `Easing.Back.InOut`
- `Easing.Bounce.In`
- `Easing.Bounce.Out`
- `Easing.Bounce.InOut`

The easing module also includes two functions that can be used to manipulate easing functions:

- `reversedEasing`: Returns a reversed easing function.
- `mirroredEasing`: Returns a mirrored easing function.

```typescript
import { Easing, reversedEasing, mirroredEasing } from "animation-essential";

Easing.Quad.Out(0.5); // Returns 0.75

reversedEasing(Easing.Quad.Out)(0.5); // Returns 0.25
Easing.Quad.In(0.5); // Equivalent as above

mirroredEasing(Easing.Quad.Out)(0.5); // Returns 0.5
Easing.Quad.InOut(0.5); // Equivalent as above
```

### Cubic Bezier

The cubic bezier module allows you to create custom easing functions using cubic bezier curves.
The `cubicBezier` function takes four arguments that define the coordinates of the two control points of the cubic bezier curve.

```typescript
import { cubicBezier } from "animation-essential";

const customEasing = cubicBezier(0.3, 0.3, 0.3, 1);
customEasing(0.5); // Returns 0.81...
```

### Spring

The spring module provides a simple and intuitive way to create spring animations.

```typescript
/**
* A configuration of a spring function.
*
* @property {number} stiffness - The stiffness of the spring. Defaults to 200.
* @property {number} damping - The damping of the spring. Defaults to 10.
* @property {number} precision - The precision of the spring. Defaults to 1e-6.
* @property {number} fps - The frame rate used to animate the spring. Defaults to 60.
*/
export type SpringConfig = Partial<Config>;

/**
 * Creates a spring object that can be used to animate values.
 *
 * @typeparam T - The type of the object being animated.
 * @param {T} obj - The object to animate.
 * @param {SpringConfig} config - The configuration of the spring.
 * @returns {Spring<T>} A spring object that can be used to animate values.
 */
function spring<T>(obj: T, config?: SpringConfig): Spring<T>;
```

```typescript
import { spring } from "animation-essential";

const testObject = {
  simpleNumber: 0,

  get posZ() { return mesh.group.position.z; },
  set posZ(v) { mesh.group.position.z = v; },
};

// Create a spring object
const springObject = spring(testObject);
requestAnimationFrame(() => {
  springObject.update();
  console.log({ ...testObject }); // Values of testObject will be animated
});

// Update properties
springObject.sampleNumber = 100;
springObject.posZ = -50;
```

### Tween

The tween module allows you to create complex animation sequences using a simple and intuitive syntax.

```typescript
import { Easing, tween, lerp } from "animation-essential";

const t = tween((t) => {
  t.on(200, 2000) // From 200ms to 2000ms
    .easing(Easing.Cubic.InOut) // Ease time with Cubic.InOut
    .run((v) => { // v is [0, 1]
      const maxZ = mainCamera.position.z - mainCamera.near;
      mesh.group.position.z = lerp(maxZ - mesh.size, 0, v);
    });
  t.on(2000, 1800)
    .easing(Easing.Cubic.Out)
    .run((v) => {
      mesh.material.reflection = lerp(0, initialMaterialParams.reflection, v);
      mesh.material.dispersion = lerp(0, initialMaterialParams.dispersion, v);
    });
  t.on(2000, 2200)
    .easing(Easing.Quart.InOut)
    .run((v) => {
      mesh.material.ior = lerp(1, initialMaterialParams.ior, v);
    });

  // Lifecycle callbacks
  t.onStart(() => {
    console.log("Tween started");
  });
  t.onEnd(() => {
    console.log("Tween ended");
  });
});

// Start the tween
requestAnimationFrame(() => t.update());
```
