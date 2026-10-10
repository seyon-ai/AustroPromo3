import React from "react";
import {Composition} from "remotion";
import {Film} from "./Film";
import {FilmVertical} from "./FilmVertical";
import {FPS, TOTAL_FRAMES} from "./timing";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AustroClashFilm" component={Film} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="AustroClashFilmVertical" component={FilmVertical} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
  </>
);
