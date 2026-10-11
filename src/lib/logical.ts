// Logical 1920×1080 (landscape) or 1080×1920 (vertical) coordinate space.
// Every scene is authored in logical pixels; a single root transform scales the film to the
// real composition size (1080p, or 4K = 2×). Lets the same layout render at any resolution.
import {useVideoConfig} from "remotion";

export const useLogical = () => {
  const c = useVideoConfig();
  const landscape = c.width > c.height;
  const scale = c.width / (landscape ? 1920 : 1080);
  return {fps: c.fps, width: c.width / scale, height: c.height / scale, scale, durationInFrames: c.durationInFrames};
};
