import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {Logo} from "./Logo";
import {easeOut} from "../lib/motion";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/** Anamorphic flare: horizontal streak, 2–4 frames (use only at 3 hero moments). */
export const Flare: React.FC<{at: number; len?: number; color?: string; y?: number; max?: number}> = ({at, len = 4, color = "#F5F5F7", y = 50, max = 0.35}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > len) return null;
  const o = interpolate(t, [0, len / 2, len], [0, max, 0], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{pointerEvents: "none", mixBlendMode: "screen", opacity: o}}>
      <div style={{position: "absolute", left: "-10%", right: "-10%", top: `${y}%`, height: 6, transform: "translateY(-50%)", background: `linear-gradient(90deg, rgba(0,0,0,0), ${color}, rgba(0,0,0,0))`, filter: "blur(2px)"}} />
      <div style={{position: "absolute", left: "-10%", right: "-10%", top: `${y}%`, height: 120, transform: "translateY(-50%)", background: `linear-gradient(90deg, rgba(0,0,0,0), ${color}33, rgba(0,0,0,0))`, filter: "blur(18px)"}} />
    </AbsoluteFill>
  );
};

/** Glow bloom on impact frames only. */
export const Bloom: React.FC<{at: number; len?: number; color?: string; max?: number; x?: number; y?: number}> = ({at, len = 10, color = "245,197,66", max = 0.5, x = 50, y = 50}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > len) return null;
  const o = interpolate(t, [0, 2, len], [0, max, 0], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{pointerEvents: "none", mixBlendMode: "screen", opacity: o, background: `radial-gradient(circle at ${x}% ${y}%, rgba(${color},0.55) 0%, rgba(${color},0.12) 30%, rgba(${color},0) 60%)`}} />
  );
};

/** White flash for the logo slam: 6 frames at 25%. */
export const Flash: React.FC<{at: number; len?: number; max?: number}> = ({at, len = 6, max = 0.25}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > len) return null;
  const o = interpolate(t, [0, 1, len], [0, max, 0], {...clamp, easing: easeOut});
  return <AbsoluteFill style={{pointerEvents: "none", background: "#FFFFFF", opacity: o}} />;
};

/** Chromatic aberration: R/B copies offset 1–2 px at low opacity, 4 frames on impacts only. */
export const Chroma: React.FC<{at: number; len?: number; children: React.ReactNode}> = ({at, len = 4, children}) => {
  const f = useCurrentFrame();
  const t = f - at;
  const active = t >= 0 && t < len;
  if (!active) return <>{children}</>;
  const o = interpolate(t, [0, len], [0.22, 0.05], {...clamp, easing: easeOut});
  return (
    <div style={{position: "absolute", inset: 0}}>
      <div style={{position: "absolute", inset: 0, transform: "translate(-2px,0)", mixBlendMode: "screen", opacity: o, filter: "hue-rotate(-40deg)"}}>{children}</div>
      <div style={{position: "absolute", inset: 0, transform: "translate(2px,0)", mixBlendMode: "screen", opacity: o, filter: "hue-rotate(40deg)"}}>{children}</div>
      <div style={{position: "absolute", inset: 0}}>{children}</div>
    </div>
  );
};

/** Light leak: slow warm/cool blurred streak, 8%, screen blend. */
export const LightLeak: React.FC<{warm?: boolean; opacity?: number}> = ({warm = true, opacity = 0.08}) => {
  const f = useCurrentFrame();
  const x = 30 + (f / 900) * 40;
  return (
    <AbsoluteFill style={{pointerEvents: "none", mixBlendMode: "screen", opacity, background: warm
      ? `linear-gradient(115deg, rgba(0,0,0,0) ${x - 12}%, rgba(255,160,80,0.9) ${x}%, rgba(0,0,0,0) ${x + 14}%)`
      : `linear-gradient(115deg, rgba(0,0,0,0) ${x - 12}%, rgba(120,170,255,0.9) ${x}%, rgba(0,0,0,0) ${x + 14}%)`, filter: "blur(40px)"}} />
  );
};

/** Watermark logo for UI scenes: 6% opacity, 8px blur, behind content. */
export const Watermark: React.FC<{size?: number; parallax?: number}> = ({size = 900, parallax = 0.4}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) translateY(${f * 0.02 * parallax}px)`, opacity: 0.06, filter: "blur(8px)"}}>
      <Logo size={size} color="#FFFFFF" />
    </div>
  );
};

/**
 * Motion-blur feel on fast moves: renders the element again at frame-1 (30%) and frame-2 (15%) under the
 * live copy. `children(offset)` must compute its motion from (frame - offset). Pure function of frame.
 */
export const Ghosts: React.FC<{active: boolean; children: (offset: number) => React.ReactNode}> = ({active, children}) => {
  if (!active) return <>{children(0)}</>;
  return (
    <div style={{position: "absolute", inset: 0, pointerEvents: "none"}}>
      <div style={{position: "absolute", inset: 0, opacity: 0.15}}>{children(2)}</div>
      <div style={{position: "absolute", inset: 0, opacity: 0.3}}>{children(1)}</div>
      <div style={{position: "absolute", inset: 0}}>{children(0)}</div>
    </div>
  );
};
