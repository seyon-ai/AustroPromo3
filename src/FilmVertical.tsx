import React from "react";
import {AbsoluteFill, useVideoConfig} from "remotion";
import {Film} from "./Film";
import {C} from "./theme";

// Vertical (1080x1920) reuses the landscape scene timing and audio.
// Dedicated stacked layouts for scenes 03/04/05/08 are the next milestone (see README, "Director's notes").
// For now the 1920x1080 canvas is fit to width and centred on the stage.
export const FilmVertical: React.FC = () => {
  const {width} = useVideoConfig();
  const k = width / 1920;
  return (
    <AbsoluteFill style={{background: C.stage, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, top: "50%", width: 1920, height: 1080, transform: `translateY(-50%) scale(${k})`, transformOrigin: "0 50%"}}>
        <Film />
      </div>
    </AbsoluteFill>
  );
};
