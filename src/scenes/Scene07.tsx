import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, } from "remotion";
import {useLogical} from "../lib/logical";
import {Stage} from "../components/Stage";
import {PhoneFrame} from "../components/Frames";
import {Bubble, Icon, ICON, TypingDots, Avatar} from "../components/UI";
import {WordReveal} from "../components/Text";
import {SoundCue} from "../components/Sound";
import {easeInOut} from "../lib/motion";
import {hitLocal, sceneDur, exitOpacity} from "../lib/scene";
import {ui} from "../theme";
import {UI_SPRING} from "../lib/motion";

// 07 — "Talk in private. Message anyone you're allowed to." Hero: private.
// Phone frame, DM bubbles spring in on alternating sides, typing indicator, one lock pulse.
// Dimmer, intimate, monochrome.
export const Scene07: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useLogical();
  const dur = sceneDur(7);
  const priv = hitLocal(7, "private"); // 28
  const lockS = spring({frame: Math.max(0, f - priv), fps, config: UI_SPRING});
  const lockScale = 1 + 0.18 * Math.sin(Math.min(1, Math.max(0, f - priv) / 14) * Math.PI) * (f >= priv ? 1 : 0);
  const cam = interpolate(f, [0, dur], [1, 1.035], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});
  const msgs = [
    {t: "Are you in for the Arena this month?", mine: false, at: 14},
    {t: "Only if the category is Science.", mine: true, at: 34},
    {t: "Post your thesis. I will vote.", mine: false, at: 58},
  ];
  const typingOn = f >= 40 && f < 58;

  return (
    <Stage dur={dur} darken={0.25} grainOpacity={0.04} spotlightX={30}>
      <AbsoluteFill style={{opacity: exitOpacity(f, dur, 12), filter: "grayscale(0.85)"}}>
        <div style={{position: "absolute", left: 130, top: 360, width: 620}}>
          <WordReveal text="Talk in private." start={hitLocal(7, "private") - 6} stagger={6} size={width > height ? 112 : 96} align="left" accent={{words: ["private."], color: "#FFFFFF"}} />
        </div>
        <PhoneFrame width={460} height={920} style={{left: 1020, top: 80}}>
          <div style={{position: "absolute", inset: 0, paddingTop: 56, boxSizing: "border-box", display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", alignItems: "center", gap: 12, padding: "0 22px 16px", borderBottom: `1px solid ${ui.border}`}}>
              <Avatar initials="MS" size={44} hue={320} />
              <div style={{fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 18, color: ui.text}}>Mira S.</div>
              <div style={{marginLeft: "auto", transform: `scale(${lockScale})`, width: 40, height: 40, borderRadius: 20, background: ui.primary, display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Icon d={ICON.lock} size={18} color="#FFFFFF" />
              </div>
            </div>
            <div style={{flex: 1, padding: 22, display: "flex", flexDirection: "column", gap: 14, justifyContent: "flex-end"}}>
              {msgs.map((m, i) => {
                const s = spring({frame: Math.max(0, f - m.at), fps, config: UI_SPRING});
                return <Bubble key={i} text={m.t} mine={m.mine} scale={0.9 + 0.1 * s} opacity={Math.min(1, s * 1.4)} y={(1 - s) * 24} />;
              })}
              {typingOn ? <TypingDots frame={f} /> : null}
            </div>
            <div style={{margin: 18, height: 52, borderRadius: 26, background: ui.surface, border: `1px solid ${ui.border}`, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: "Inter, sans-serif", color: ui.muted, fontSize: 15}}>Message</div>
          </div>
        </PhoneFrame>
        <SoundCue frame={priv} src="sfx/shimmer.wav" volume={0.5} />
      </AbsoluteFill>
    </Stage>
  );
};
