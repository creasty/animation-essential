type EasingFunc = (t: number) => number;
type RunCallback = (t: number) => void;
type Callback = () => void;

class Tween {
  #t?: number;
  #startTime: number;
  #endTime: number;
  #easingFunc: EasingFunc = (t) => t;
  #hasStarted = false;

  #startCallbacks: Callback[] = [];
  #runCallbacks: RunCallback[] = [];
  #endCallbacks: Callback[] = [];

  constructor(startTime: number, duration: number) {
    this.#startTime = startTime;
    this.#endTime = startTime + duration;
  }

  easing(func: EasingFunc) {
    this.#easingFunc = func;
    return this;
  }

  onStart(fn: Callback) {
    this.#startCallbacks.push(fn);
    return this;
  }
  run(fn: RunCallback) {
    this.#runCallbacks.push(fn);
    return this;
  }
  onEnd(fn: Callback) {
    this.#endCallbacks.push(fn);
    return this;
  }

  update(time: number) {
    const t = Math.min(Math.max(0, (time - this.#startTime) / (this.#endTime - this.#startTime)), 1);
    if (this.#t === t) return;
    if (!this.#t || this.#t > t) this.#hasStarted = false;
    this.#t = t;

    if (!this.#hasStarted) {
      this.#hasStarted = true;
      this.#startCallbacks.forEach((fn) => fn());
    }

    const tt = this.#easingFunc(t);
    this.#runCallbacks.forEach((fn) => fn(tt));

    if (t === 1) {
      this.#endCallbacks.forEach((fn) => fn());
    }
  }

  get startTime() {
    return this.#startTime;
  }
  get endTime() {
    return this.#endTime;
  }
  get hasEnded() {
    return this.#t === 1;
  }
}

type Context = {
  offset: number;
  tweens: Tween[];
};

class TweenSequence {
  context: Context;
  parentContext?: Context;

  #t?: number;
  #hasStarted = false;

  #startCallbacks: Callback[] = [];
  #endCallbacks: Callback[] = [];

  constructor(context: Context, parentContext?: Context) {
    this.context = context;
    this.parentContext = parentContext;
  }

  on(offset: number, duration: number) {
    const tween = new Tween(offset, duration);
    this.context.offset = Math.max(this.context.offset, tween.endTime);
    this.context.tweens.push(tween);
    if (this.parentContext) {
      this.parentContext.offset = Math.max(this.parentContext.offset, this.context.offset);
      this.parentContext.tweens.push(tween);
    }
    return tween;
  }
  then(offset: number, duration: number) {
    const tween = new Tween(this.context.offset + offset, duration);
    this.context.offset = Math.max(this.context.offset, tween.endTime);
    this.context.tweens.push(tween);
    if (this.parentContext) {
      this.parentContext.offset = Math.max(this.parentContext.offset, this.context.offset);
      this.parentContext.tweens.push(tween);
    }
    return tween;
  }
  chain(...tweens: Tween[]) {
    const childContext: Context = {
      offset: Math.max(...tweens.map((t) => t.endTime)),
      tweens: [],
    };
    return new TweenSequence(childContext, this.context);
  }

  onStart(fn: Callback) {
    this.#startCallbacks.push(fn);
    return this;
  }
  onEnd(fn: Callback) {
    this.#endCallbacks.push(fn);
    return this;
  }

  update(time: number) {
    const t = Math.min(Math.max(0, time / this.context.offset), 1);
    if (this.#t === t) return;
    if (!this.#t || this.#t > t) this.#hasStarted = false;
    this.#t = t;

    if (!this.#hasStarted) {
      this.#hasStarted = true;
      this.#startCallbacks.forEach((fn) => fn());
    }
    this.context.tweens.forEach((tween) => tween.update(time));
    if (t === 1) {
      this.#endCallbacks.forEach((fn) => fn());
    }
  }
}

export function tween(dsl: (t: TweenSequence) => void) {
  const sequence = new TweenSequence({
    offset: 0,
    tweens: [],
  });
  dsl(sequence);
  return sequence;
}
