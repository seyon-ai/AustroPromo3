// Pure, frame-driven motion helpers. No CSS transitions, no timers, no Math.random.
import {Easing, interpolate, spring} from "remotion";

const clampOpts = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

/** Clamped linear-in-range, eased. */
export const ramp = (f: number, a: number, b: number, from = 0, to = 1, ease: (t: number) => number = easeOut) =>
  interpolate(f, [a, b], [from, to], {...clampOpts, easing: ease});

/** Spring presets. UI: overdamped (no bounce). HERO: the only springs allowed to overshoot. */
export const UI_SPRING: {damping: number; stiffness: number; mass: number} = {damping: 200, stiffness: 170, mass: 1};
export const HERO_SPRING: {damping: number; stiffness: number; mass: number} = {damping: 14, stiffness: 120, mass: 0.8};

/** Spring entrance (R2/R3). Returns 0→1. Defaults to the UI preset. */
export const sp = (frame: number, fps: number, delay = 0, damping = UI_SPRING.damping, stiffness = UI_SPRING.stiffness, mass = UI_SPRING.mass) =>
  frame - delay <= 0 ? 0 : spring({frame: frame - delay, fps, config: {damping, stiffness, mass}});

/**
 * R6 freeze: map real frame → motion time. Between `at` and `at+len` motion time holds still.
 * Only motion driven by the returned value freezes; grain and audio keep running.
 */
export const motionTime = (f: number, freezes: {at: number; len: number}[]) => {
  let m = f;
  for (const z of freezes) {
    if (f >= z.at + z.len) m -= z.len;
    else if (f > z.at) m -= f - z.at;
  }
  return m;
};

/** Anticipation (R3): tiny counter-move before a hero launch, then the launch. */
export const anticipate = (f: number, start: number, px: number) =>
  interpolate(f, [start, start + 3, start + 9], [0, -px, 0], {...clampOpts, easing: easeOut});

/** Pop = one sprite at a time (R8); gentle scale overshoot for hero elements. */
export const overshootScale = (frame: number, fps: number, delay = 0) =>
  frame - delay <= 0 ? 0 : spring({frame: frame - delay, fps, config: HERO_SPRING});

/** Deterministic pseudo-random in [0,1) per seed (replacement for Math.random). */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
