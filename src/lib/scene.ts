// Helpers that convert generated timing (global frames) into scene-local frames.
import {SCENE} from "../timing";
import {interpolate} from "remotion";
import {easeIn} from "./motion";

/** Local frame at which the visual hits for a hero word (audio frame − 6, R7). */
export const hitLocal = (id: number, word: string): number => {
  const s = SCENE(id);
  const h = s.heroes.find((x) => x.word === word);
  if (!h) throw new Error(`no hero "${word}" in scene ${id}`);
  return h.visualFrame - s.start;
};
/** Local frame at which the word is actually spoken. */
export const spokenLocal = (id: number, word: string): number => {
  const s = SCENE(id);
  const h = s.heroes.find((x) => x.word === word);
  if (!h) throw new Error(`no hero "${word}" in scene ${id}`);
  return h.audioFrame - s.start;
};
/** VO begins at this local frame (R1: scene 1 starts on frame 0). */
export const voLocal = (id: number): number => SCENE(id).voStart - SCENE(id).start;
export const sceneDur = (id: number): number => SCENE(id).duration;

/** Exit: everything leaves with ease-in over the last n frames (R2). */
export const exitOpacity = (f: number, dur: number, n = 12) =>
  interpolate(f, [dur - n, dur], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIn});
