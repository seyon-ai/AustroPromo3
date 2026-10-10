import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from "remotion";
import {SCENES, TOTAL_FRAMES} from "./timing";
import {C} from "./theme";
import {Scene01} from "./scenes/Scene01";
import {Scene02} from "./scenes/Scene02";
import {Scene03} from "./scenes/Scene03";
import {Scene04} from "./scenes/Scene04";
import {Scene05} from "./scenes/Scene05";
import {Scene06} from "./scenes/Scene06";
import {Scene07} from "./scenes/Scene07";
import {Scene08} from "./scenes/Scene08";
import {Scene09} from "./scenes/Scene09";
import {Scene10} from "./scenes/Scene10";

// Music bed levels (brief §6): MUSIC_GAIN 0.16, duck to 0.09 under VO, swell to 0.32 in the final 3 s.
export const MUSIC_GAIN = 0.16;
const DUCKED = 0.09;
const SWELL = 0.32;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const musicVolume = (f: number) => {
  let duck = 0;
  for (const s of SCENES) {
    const a = s.voStart;
    const b = s.voStart + s.voFrames;
    duck = Math.max(duck, interpolate(f, [a - 6, a, b, b + 6], [0, 1, 1, 0], clamp));
  }
  const base = MUSIC_GAIN + (DUCKED - MUSIC_GAIN) * duck;
  const swell = interpolate(f, [TOTAL_FRAMES - 90, TOTAL_FRAMES - 1], [1, SWELL / MUSIC_GAIN], clamp);
  return base * swell;
};

const SCENE_COMPONENTS = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09, Scene10];

/** Global one-shot cues that span scene boundaries (riser into 2 and 10, logo slam). */
const GLOBAL_CUES: {at: number; src: string; volume: number}[] = [
  {at: SCENES[1].start - 36, src: "sfx/riser.wav", volume: 0.45}, // riser ends on the cut into scene 2
  {at: SCENES[1].start + 20, src: "sfx/impact.wav", volume: 0.6}, // logo slam
  {at: SCENES[9].start - 36, src: "sfx/riser.wav", volume: 0.45}, // riser ends on the cut into scene 10
];
const CUT_WHOOSH = [3, 4, 5, 6, 7]; // scenes whose cut-in whoosh is global; 8 & 9 carry their own

export const Film: React.FC = () => (
  <AbsoluteFill style={{background: C.stage}}>
    {SCENES.map((s, i) => {
      const Comp = SCENE_COMPONENTS[i];
      return (
        <Sequence key={s.id} from={s.start} durationInFrames={s.duration} name={`Scene ${String(s.id).padStart(2, "0")}`}>
          <Comp />
        </Sequence>
      );
    })}

    {/* voiceover: one clip per scene, starts at its voStart */}
    {SCENES.map((s) => (
      <Sequence key={`vo${s.id}`} from={s.voStart} durationInFrames={s.voFrames + 12} layout="none">
        <Audio src={staticFile(`vo/${String(s.id).padStart(2, "0")}.mp3`)} volume={1} />
      </Sequence>
    ))}

    {/* music bed with ducking and final swell */}
    <Audio src={staticFile("music.wav")} volume={musicVolume} />

    {GLOBAL_CUES.map((c, i) => (
      <Sequence key={`cue${i}`} from={Math.max(0, c.at)} layout="none">
        <Audio src={staticFile(c.src)} volume={c.volume} />
      </Sequence>
    ))}
    {CUT_WHOOSH.map((idx) => (
      <Sequence key={`w${idx}`} from={Math.max(0, SCENES[idx].start - 8)} layout="none">
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
