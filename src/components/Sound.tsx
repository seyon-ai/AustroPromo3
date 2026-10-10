import React from "react";
import {Audio, Sequence, staticFile} from "remotion";

/** One-shot sound effect placed at a local frame (scene-relative). */
export const SoundCue: React.FC<{frame: number; src: string; volume?: number}> = ({frame, src, volume = 0.8}) => (
  <Sequence from={Math.max(0, frame)} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);
