import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {ramp, easeInOut} from "../lib/motion";

/**
 * Chevron shape-wipe: a slanted, logo-angled band sweeps across the frame over `len` frames,
 * covering the hard cut underneath. Pure function of frame.
 */
export const ChevronWipe: React.FC<{len?: number; color?: string; peak?: number}> = ({len = 16, color = "#F5F5F7", peak = 0.9}) => {
  const f = useCurrentFrame();
  if (f < 0 || f > len) return null;
  const t = f / len;
  const x = ramp(t, 0, 1, -40, 140, easeInOut);
  const o = ramp(t, 0, 0.5, 0, peak, (u) => u) * (1 - ramp(t, 0.5, 1, 0, 1, (u) => u));
  const band = `polygon(${x - 22}% 0%, ${x - 8}% 0%, ${x - 8 + 26}% 100%, ${x - 22 + 26}% 100%)`;
  return (
    <AbsoluteFill style={{pointerEvents: "none", opacity: o}}>
      <div style={{position: "absolute", inset: 0, background: color, clipPath: band}} />
    </AbsoluteFill>
  );
};
