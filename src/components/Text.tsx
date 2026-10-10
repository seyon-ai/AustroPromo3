import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {DISPLAY, UI} from "../fonts";
import {C} from "../theme";
import {sp} from "../lib/motion";

/**
 * Word-by-word spring reveal with blur-in (headline standard, R5: one reveal at a time).
 * `hero` words get the gold/violet accent colour and a stronger overshoot.
 */
export const WordReveal: React.FC<{
  text: string;
  start: number;          // local frame of first word
  stagger?: number;       // frames between words
  size?: number;
  color?: string;
  accent?: {words: string[]; color: string};
  align?: "left" | "center";
  maxWidth?: number;
  lineHeight?: number;
  weight?: number;
}> = ({text, start, stagger = 4, size = 120, color = C.text, accent, align = "center", maxWidth = 1500, lineHeight = 0.98, weight = 700}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight, letterSpacing: "-0.03em", color, textAlign: align, maxWidth, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26, rowGap: size * 0.04}}>
      {words.map((w, i) => {
        const delay = start + i * stagger;
        const s = sp(f, fps, delay, 14, 170);
        const blur = interpolate(s, [0, 1], [12, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const y = interpolate(s, [0, 1], [18, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const isAccent = accent?.words.some((a) => w.replace(/[^A-Za-z]/g, "") === a.replace(/[^A-Za-z]/g, ""));
        return (
          <span key={i} style={{display: "inline-block", opacity: Math.min(1, s * 1.4), transform: `translateY(${y}px)`, filter: `blur(${blur}px)`, color: isAccent && accent ? accent.color : color}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Wordmark: letter clip-path wipe (vocabulary 2) with text-as-mask light sweep (vocabulary 12). */
export const Wordmark: React.FC<{start: number; size: number; color?: string; sweep?: boolean; sweepStart?: number; glow?: string}> = ({start, size, color = C.text, sweep = false, sweepStart = 0, glow}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const letters = "AUSTROCLASH".split("");
  const sweepX = sweep ? interpolate(f, [sweepStart, sweepStart + 40], [-40, 140], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 0;
  const maskBg = sweep
    ? `linear-gradient(100deg, ${color} 0%, ${color} ${sweepX - 14}%, #FFFFFF ${sweepX}%, ${color} ${sweepX + 14}%, ${color} 100%)`
    : color;
  return (
    <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: "0.18em", lineHeight: 1, display: "flex", whiteSpace: "nowrap", filter: glow}}>
      {letters.map((ch, i) => {
        const d = start + i * 2;
        const p = interpolate(f, [d, d + 10], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const clip = `inset(0 ${(1 - p) * 100}% 0 0)`;
        return (
          <span key={i} style={{display: "inline-block", clipPath: clip, backgroundImage: maskBg, WebkitBackgroundClip: "text", backgroundClip: "text", color: sweep ? "transparent" : color}}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const SiteUrl: React.FC<{size?: number; opacity?: number}> = ({size = 26, opacity = 1}) => (
  <div style={{fontFamily: UI, fontWeight: 500, fontSize: size, color: C.muted, letterSpacing: "0.02em", opacity}}>
    {"austroclash.com"}
  </div>
);
