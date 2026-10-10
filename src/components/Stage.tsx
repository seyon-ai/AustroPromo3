import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {C} from "../theme";
import {Logo} from "./Logo";
import {easeInOut} from "../lib/motion";

/** Film grain: feTurbulence re-seeded every frame, 4% opacity (cinematic layer). */
export const Grain: React.FC<{opacity?: number; id?: string}> = ({opacity = 0.04, id = "g"}) => {
  const f = useCurrentFrame();
  return (
    <svg style={{position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity, mixBlendMode: "overlay"}}>
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 997} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
};

/** Stage: #06060A with radial lift to #12121A, drifting 18% spotlight, 40% corner vignette. */
export const Stage: React.FC<{
  children?: React.ReactNode;
  watermark?: boolean;
  spotlightX?: number;
  grainOpacity?: number;
  darken?: number; // 0..1 extra dim (intimate scenes)
  tilt?: number;   // camera-ish rotation in degrees (<= 2)
  camera?: number; // scale (<= 1.04 per scene)
}> = ({children, watermark = false, spotlightX = 50, grainOpacity = 0.04, darken = 0, tilt = 0, camera = 1}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const drift = Math.sin((f / 30) * 0.5) * 6;   // slow (~0.08 Hz) drift, not a bob
  return (
    <AbsoluteFill style={{background: C.stage, overflow: "hidden"}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${C.stageLift} 0%, ${C.stage} 70%)`}} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${spotlightX + drift}% 22%, rgba(245,245,247,0.18) 0%, rgba(245,245,247,0) 42%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)"}}
      />
      {watermark ? (
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.06, filter: "blur(8px)"}}>
          <Logo size={Math.min(width, height) * 0.7} color="#FFFFFF" />
        </div>
      ) : null}
      {darken > 0 ? <AbsoluteFill style={{background: `rgba(0,0,0,${darken})`}} /> : null}
      <AbsoluteFill
        style={{
          transform: `scale(${camera}) rotate(${tilt}deg)`,
          transformOrigin: "50% 50%",
        }}
      >
        {children}
      </AbsoluteFill>
      <Grain opacity={grainOpacity} />
    </AbsoluteFill>
  );
};

/** Camera move: scale 1.00 → 1.04 with inOut cubic over `dur` frames (R11). */
export const camScale = (f: number, dur: number, to = 1.04) =>
  interpolate(f, [0, dur], [1, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});
