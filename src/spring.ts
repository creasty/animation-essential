type Config = {
  stiffness: number;
  damping: number;
  precision: number;
  fps: number;
};

const defaultConfig: Config = {
  stiffness: 200,
  damping: 10,
  precision: 1e-6,
  fps: 60,
};

type State = {
  terminal: number;
  velocity: number;
};

type Values<T> = { [K in keyof T as T[K] extends number ? K : never]: number };

class SpringObject<T> {
  #values: Values<T>;
  #states: Partial<Record<keyof Values<T>, State>>;
  #config: Config;

  constructor(values: T, config: Config) {
    this.#values = values as any;
    this.#states = {};
    this.#config = config;
  }

  get = (key: keyof Values<T>): number => {
    return this.#states[key]?.terminal ?? this.#values[key];
  };

  getActual = (key: keyof Values<T>): number => {
    return this.#values[key];
  };

  isTransitioning = (key?: keyof Values<T>): boolean => {
    if (key) {
      return !!this.#states[key];
    }
    return Object.keys(this.#states).length > 0;
  };

  stop = (key?: keyof Values<T>) => {
    if (key) {
      delete this.#states[key];
      return;
    }
    this.#states = {};
  };

  set = (key: keyof Values<T>, value: number, immediate = false) => {
    if (immediate) {
      this.#values[key] = value;
      delete this.#states[key];
      return;
    }

    if (value === this.#values[key]) return;
    if (value === this.#states[key]?.terminal) return;
    this.#states[key] = {
      terminal: value,
      velocity: this.#states[key]?.velocity ?? 0,
    };
  };

  assign = (values: Partial<Values<T>>, immediate = false) => {
    for (const key in values) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.set(key, values[key]!, immediate);
    }
  };

  update = () => {
    for (const key in this.#states) {
      const value = this.#values[key];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const state = this.#states[key]!;

      const distance = state.terminal - value;
      const acceleration = this.#config.stiffness * distance - this.#config.damping * state.velocity;
      const newVelocity = state.velocity + acceleration / this.#config.fps;
      const newValue = value + newVelocity / this.#config.fps;

      const isComplete = Math.max(Math.abs(newVelocity), Math.abs(newValue - state.terminal)) < this.#config.precision;

      this.#values[key] = isComplete ? state.terminal : newValue;

      if (isComplete) {
        delete this.#states[key];
      } else {
        state.velocity = newVelocity;
      }
    }
  };
}

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
 * A spring object that can be used to animate values.
 * Only numeric values can be animated.
 */
export type Spring<T> = Values<T> & InstanceType<typeof SpringObject<T>>;

/**
 * Creates a spring object that can be used to animate values.
 *
 * @typeparam T - The type of the object being animated.
 * @param {T} obj - The object to animate.
 * @param {SpringConfig} config - The configuration of the spring.
 * @returns {Spring<T>} A spring object that can be used to animate values.
 */
export function spring<T>(obj: T, config: SpringConfig = {}): Spring<T> {
  const spring = new SpringObject(obj, {
    ...defaultConfig,
    ...config,
  });

  return new Proxy({} as Spring<T>, {
    get(_target, key) {
      if (key in spring) {
        return (spring as any)[key];
      }
      return spring.get(key as any);
    },
    set(_target, key, value) {
      spring.set(key as any, value);
      return true;
    },
  });
}
