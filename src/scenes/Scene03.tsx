import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {Stage} from "../components/Stage";
import {BrowserFrame} from "../components/Frames";
import {ArenaTile, Header, Sidebar} from "../components/UI";
import {WordReveal} from "../components/Text";
import {SoundCue} from "../components/Sound";
import {easeInOut, easeOut, motionTime} from "../lib/motion";
import {hitLocal, sceneDur, exitOpacity} from "../lib/scene";
import {logoMaskUri} from "../lib/maskSvg";
import {ui} from "../theme";

// 03 — "Post in the Arena. Choose your category." Hero: Arena.
// Browser rises (anticipation), Arena revealed through a growing logo-shaped mask,
// tiles waterfall in diagonally, one tile rack-focuses.
const TILES = [
  ["Technology", "Build and ship"],
  ["Science", "Evidence first"],
  ["Society", "How we live"],
  ["Culture", "Art and meaning"],
  ["Business", "Strategy and markets"],
  ["Geopolitics", "Power and order"],
];

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = sceneDur(3);
  const hit = hitLocal(3, "Arena");               // 37
  const focus = 70;                              // rack focus on category choice
  const m = motionTime(f, []);

  // browser rises with 3-frame counter-move (R3)
  const rise = interpolate(f, [0, 3, 22], [0, 6, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  const riseSpring = spring({frame: Math.max(0, f - 1), fps, config: {damping: 16, stiffness: 120}});
  const browserY = interpolate(riseSpring, [0, 1], [320, 0]) + rise;

  // chevron mask grows from the logo's centre to fully reveal the Arena (vocab 11)
  const maskPct = interpolate(f, [hit - 8, hit + 26], [6, 260], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});

  return (
    <Stage grainOpacity={0.045} watermark spotlightX={68}>
      <AbsoluteFill style={{opacity: exitOpacity(f, dur, 12)}}>
        <div style={{position: "absolute", left: 120, top: 250, width: 520}}>
          <WordReveal text="Post in the Arena." start={22} stagger={4} size={96} align="left" accent={{words: ["Arena."], color: "#FFFFFF"}} />
          <div style={{height: 26}} />
          <WordReveal text="Choose your category." start={66} stagger={4} size={96} align="left" color="rgba(245,245,247,0.6)" />
        </div>

        <BrowserFrame width={1120} height={700} style={{left: 700, top: 180 + browserY, transform: "perspective(2400px) rotateY(-6deg) rotateX(2deg)"}} perspective={false}>
          <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column"}}>
            <Header width={1120} active="Arena" compact />
            <div style={{display: "flex", flex: 1}}>
              <Sidebar width={180} active="Arena" />
              <div style={{flex: 1, padding: 26, boxSizing: "border-box", WebkitMaskImage: logoMaskUri(), maskImage: logoMaskUri(), WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "50% 50%", maskPosition: "50% 50%", WebkitMaskSize: `${maskPct}% ${maskPct}%`, maskSize: `${maskPct}% ${maskPct}%`}}>
                <div style={{fontFamily: "Inter, sans-serif", fontSize: 26, fontWeight: 700, color: ui.text}}>Category Arena</div>
                <div style={{fontFamily: "Inter, sans-serif", fontSize: 15, color: ui.muted, marginTop: 4}}>Monthly vote competitions, by category</div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 26}}>
                  {TILES.map(([name, sub], i) => {
                    const r = Math.floor(i / 3);
                    const c = i % 3;
                    const delay = 34 + (r + c) * 4; // diagonal waterfall (common fate)
                    const s = spring({frame: Math.max(0, f - delay), fps, config: {damping: 14, stiffness: 150}});
                    const isFocus = i === 0;
                    const blur = isFocus
                      ? interpolate(f, [focus - 6, focus + 16], [12, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut})
                      : interpolate(f, [focus - 6, focus + 16], [0, 3], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
                    return (
                      <div key={name} style={{transform: `translateY(${(1 - s) * 70}px) scale(${isFocus ? 1.03 : 1})`, opacity: Math.min(1, s * 1.3)}}>
                        <ArenaTile name={name} sub={sub} width={300} height={180} active={isFocus} blur={blur} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </BrowserFrame>
        <SoundCue frame={focus} src="sfx/tick.wav" volume={0.7} />
      </AbsoluteFill>
    </Stage>
  );
};
