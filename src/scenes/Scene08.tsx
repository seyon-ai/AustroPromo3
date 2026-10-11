import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, } from "remotion";
import {useLogical} from "../lib/logical";
import {Stage} from "../components/Stage";
import {Chip, Icon, ICON, NeedCard, ProviderReply} from "../components/UI";
import {WordReveal} from "../components/Text";
import {Flash, Bloom} from "../components/Effects";
import {SoundCue} from "../components/Sound";
import {easeInOut, easeOut, motionTime} from "../lib/motion";
import {hitLocal, sceneDur, exitOpacity} from "../lib/scene";
import {UI_SPRING} from "../lib/motion";

// 08 — "Need something built? Post it in AUSTRO VAR — the Value and Resource Arena. Providers respond. You choose."
// Heroes: VAR, choose. Accent glides from neutral → VIOLET (only in this scene) via a glass morph.
// Need card centre; three provider replies flip in from the right; on "choose" one gets a Selected tick.
const VAR = hitLocal(8, "VAR");        // 115
const CHOOSE = hitLocal(8, "choose");  // 279
const VIOLET = "#7C5CFF";

export const Scene08: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useLogical();
  const dur = sceneDur(8);
  const m = motionTime(f, [{at: CHOOSE, len: 10}]);
  const vw = width > height;

  // glass morph: a small glass chip grows into the full panel (no cut)
  const morph = interpolate(f, [0, 52], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});
  const pW = interpolate(morph, [0, 1], [420, 1700], {easing: easeOut});
  const pH = interpolate(morph, [0, 1], [150, 860], {easing: easeOut});
  const pL = interpolate(morph, [0, 1], [750, 110], {easing: easeOut});
  const pT = interpolate(morph, [0, 1], [465, 110], {easing: easeOut});
  const pR = interpolate(morph, [0, 1], [48, 26], {easing: easeOut});
  const violetA = interpolate(f, [0, 60], [0, 0.32], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

  const needS = spring({frame: Math.max(0, m - 56), fps, config: UI_SPRING});
  const replies = [
    {name: "Dev P.", ini: "DP", hue: 150, text: "Two-day brand kit with three concepts and a usage guide."},
    {name: "Mira S.", ini: "MS", hue: 320, text: "Logo and brand system in one sprint, with a clear fixed price."},
    {name: "Arjun K.", ini: "AK", hue: 210, text: "Concept review first, then a full kit once you approve a direction."},
  ];
  const picked = 1;
  const pickS = spring({frame: Math.max(0, f - CHOOSE), fps, config: UI_SPRING});

  return (
    <Stage dur={dur} grainOpacity={0.04} spotlightX={50}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, rgba(124,92,255,${violetA}) 0%, rgba(124,92,255,0) 60%)`}} />
      <AbsoluteFill style={{opacity: exitOpacity(f, dur, 12)}}>
        {/* glass panel morph */}
        <div style={{position: "absolute", left: pL, top: pT, width: pW, height: pH, borderRadius: pR * 1.2, boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: `1px solid rgba(124,92,255,${0.25 + 0.5 * morph})`, boxShadow: `0 40px 120px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`, backdropFilter: "blur(12px)", overflow: "hidden"}}>
          <div style={{position: "absolute", inset: 0, opacity: Math.max(0, (morph - 0.55) / 0.45)}}>
            <div style={{position: "absolute", left: 60, top: 56}}>
              <WordReveal text="AUSTRO VAR" start={VAR - 6} stagger={6} size={vw ? 96 : 84} align="left" color="#FFFFFF" accent={{words: ["VAR"], color: VIOLET}} />
              <div style={{marginTop: 14, fontFamily: "Inter, sans-serif", fontSize: 24, color: "rgba(245,245,247,0.7)"}}>The Value and Resource Arena</div>
            </div>
            <div style={{position: "absolute", left: 60, top: 300, transform: `translateX(${(1 - needS) * -80}px)`, opacity: needS}}>
              <NeedCard width={740} title="Need a brand kit for our squad" body="Post the need, set the budget and timeline. Providers respond, and you choose who builds it." tags={["Design", "Brand", "Fixed scope"]} />
            </div>
            <div style={{position: "absolute", right: 60, top: 270, display: "flex", flexDirection: "column", gap: 20, width: 740}}>
              {replies.map((r, i) => {
                const d = 150 + i * 4;
                const flip = spring({frame: Math.max(0, m - d), fps, config: UI_SPRING});
                const isPick = i === picked;
                return (
                  <ProviderReply key={r.name} name={r.name} initials={r.ini} hue={r.hue} text={r.text} width={740} flip={flip}
                    selected={isPick && f >= CHOOSE} dim={!isPick && f >= CHOOSE ? interpolate(f, [CHOOSE, CHOOSE + 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut }) : 0} />
                );
              })}
            </div>
          </div>
        </div>
        <Bloom at={CHOOSE} len={10} max={0.25} color="124,92,255" x={72} y={50} />
        <Flash at={CHOOSE} len={4} max={0.08} />
        <SoundCue frame={CHOOSE} src="sfx/pop.wav" volume={0.7} />
        <SoundCue frame={0} src="sfx/whoosh.wav" volume={0.4} />
      </AbsoluteFill>
    </Stage>
  );
};
