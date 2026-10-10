import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {Stage} from "../components/Stage";
import {BadgeTile, Avatar, ProfileCard, ICON} from "../components/UI";
import {WordReveal} from "../components/Text";
import {SoundCue} from "../components/Sound";
import {easeOut, easeInOut} from "../lib/motion";
import {hitLocal, sceneDur, exitOpacity} from "../lib/scene";
import {rnd} from "../lib/motion";

// 06 — "Build your profile. Earn your badges. Form Squads with your Allies." Hero: Squads.
// Three beat-cuts: profile header → badges 3D-flip (4-frame stagger) → magnetic cluster
// (Squads) with an Ally line drawn toward the next cut.
const CUT_B = 70;
const CUT_C = 140;
const SQUADS = hitLocal(6, "Squads"); // 142

const MEMBERS = [
  ["AK", 210], ["MS", 320], ["DP", 150], ["RT", 30], ["LN", 260], ["JK", 90], ["OV", 200],
];

export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const dur = sceneDur(6);
  const vw = width > height;
  const cam = interpolate(f, [0, dur], [1, 1.04], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});

  const cutA = f < CUT_B;
  const cutB = f >= CUT_B && f < CUT_C;
  const cutC = f >= CUT_C;

  // cut A: profile
  const aS = spring({frame: f, fps, config: {damping: 16, stiffness: 120}});

  // cut B: badges flip with 4-frame stagger (3D rotateY)
  const badges = [["First Post", 210, ICON.pen], ["First Clash", 320, ICON.shield], ["Squad Founder", 150, ICON.users], ["Ally", 40, ICON.star]];

  // cut C: magnetic cluster drawn to a centre with orbit
  const cx = vw ? 620 : 560;
  const cy = 540;
  const orbitT = f - CUT_C;
  const pull = spring({frame: Math.max(0, orbitT - 6), fps, config: {damping: 13, stiffness: 110}});

  // Ally line draws toward the Allies panel (line draw, vocab 6)
  const lineLen = 1000;
  const lineP = interpolate(f, [SQUADS + 30, SQUADS + 80], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});

  return (
    <Stage grainOpacity={0.045} watermark spotlightX={50} camera={cam}>
      <AbsoluteFill style={{opacity: exitOpacity(f, dur, 12)}}>
        {cutA ? (
          <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: Math.min(1, aS * 1.2), transform: `translateY(${(1 - aS) * 40}px)`}}>
            <ProfileCard width={760} name="Arjun K." handle="arjun" initials="AK" bio="Writes about cities, energy and the economics of everyday choices." />
          </AbsoluteFill>
        ) : null}

        {cutB ? (
          <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
            <div style={{display: "flex", gap: 26}}>
              {badges.map(([label, hue, glyph], i) => {
                const s = spring({frame: Math.max(0, f - CUT_B - i * 4), fps, config: {damping: 14, stiffness: 160}});
                return <BadgeTile key={label as string} label={label as string} hue={hue as number} glyph={glyph as string} width={190} flip={s} />;
              })}
            </div>
          </AbsoluteFill>
        ) : null}

        {cutC ? (
          <AbsoluteFill>
            {/* Squads headline */}
            <div style={{position: "absolute", left: 120, top: 110, width: 900}}>
              <WordReveal text="Form Squads with Allies." start={SQUADS - 8} stagger={6} size={vw ? 96 : 88} align="left" accent={{words: ["Squads"], color: "#FFFFFF"}} />
            </div>
            {/* magnetic cluster */}
            <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: "100%"}}>
              {MEMBERS.map(([ini, hue], i) => {
                const a = (i / MEMBERS.length) * Math.PI * 2;
                const r0 = 520 + rnd(i + 4) * 120;
                const startX = cx + Math.cos(a) * r0;
                const startY = cy + Math.sin(a) * r0 * 0.6;
                const orbit = orbitT > 40 ? Math.sin((orbitT - 40) / 40 + i) * 14 : 0; // slow orbit
                const x = interpolate(pull, [0, 1], [startX, cx + Math.cos(a) * 150]) + orbit;
                const y = interpolate(pull, [0, 1], [startY, cy + Math.sin(a) * 110]);
                return (
                  <div key={i} style={{position: "absolute", left: x - 34, top: y - 34}}>
                    <Avatar initials={ini as string} size={68} hue={hue as number} ring="#FFFFFF" />
                  </div>
                );
              })}
              <div style={{position: "absolute", left: cx - 56, top: cy - 56, width: 112, height: 112, borderRadius: 56, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", opacity: pull, transform: `scale(${pull})`}}>
                <div style={{fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: "0.04em", color: "#161A1D"}}>SQ</div>
              </div>
              {/* Ally line (leads the eye right) */}
              <svg width="100%" height="100%" style={{position: "absolute", inset: 0, overflow: "visible"}}>
                <path d={`M ${cx + 150} ${cy} C ${cx + 420} ${cy - 120}, ${cx + 540} ${cy + 110}, ${width - 520} ${cy}`} fill="none" stroke="rgba(245,245,247,0.8)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray={lineLen} strokeDashoffset={lineLen * (1 - lineP)} />
              </svg>
              <div style={{position: "absolute", right: 150, top: cy - 170, width: 420, opacity: lineP, transform: `translateX(${(1 - lineP) * 40}px)`}}>
                {[["Mira S.", "MS", 320], ["Dev P.", "DP", 150], ["Arjun K.", "AK", 210]].map(([n, ini, hue]) => (
                  <div key={n as string} style={{display: "flex", alignItems: "center", gap: 14, background: "#FFFFFF", borderRadius: 14, padding: "14px 18px", marginBottom: 12, fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#161A1D"}}>
                    <Avatar initials={ini as string} size={40} hue={hue as number} />
                    {n as string}
                    <span style={{marginLeft: "auto", fontSize: 13, color: "#737373", fontWeight: 500}}>Ally</span>
                  </div>
                ))}
              </div>
            </div>
          </AbsoluteFill>
        ) : null}

        <SoundCue frame={CUT_B} src="sfx/whoosh.wav" volume={0.5} />
        <SoundCue frame={CUT_C} src="sfx/whoosh.wav" volume={0.5} />
        <SoundCue frame={SQUADS} src="sfx/pop.wav" volume={0.6} />
      </AbsoluteFill>
    </Stage>
  );
};
