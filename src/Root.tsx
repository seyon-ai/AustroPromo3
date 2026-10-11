import React from "react";
import {AbsoluteFill, Composition} from "remotion";
import {Film} from "./Film";
import {FilmVertical} from "./FilmVertical";
import {FPS, TOTAL_FRAMES} from "./timing";
import {useLogical} from "./lib/logical";

// Scales the 1920×1080 logical film to the real canvas (4K = 2×).
const Scaled: React.FC<{children: React.ReactNode}> = ({children}) => {
  const L = useLogical();
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, top: 0, width: L.width, height: L.height, transform: `scale(${L.scale})`, transformOrigin: "0 0"}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

const LandscapeFilm: React.FC = () => <Scaled><Film /></Scaled>;
const VerticalFilm: React.FC = () => <Scaled><FilmVertical /></Scaled>;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AustroClashFilm" component={LandscapeFilm} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="AustroClashFilmVertical" component={VerticalFilm} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
  </>
);
