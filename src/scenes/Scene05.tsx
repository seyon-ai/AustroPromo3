import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, } from "remotion";
import {useLogical} from "../lib/logical";
import {Stage} from "../components/Stage";
import {BrowserFrame} from "../components/Frames";
import {KingRow} from "../components/UI";
import {WordReveal} from "../components/Text";
import {easeOut, easeInOut} from "../lib/motion";
import {hitLocal, sceneDur, exitOpacity} from "../lib/scene";
import {SoundCue} from "../components/Sound";
import {ui} from "../theme";
import {UI_SPRING} from "../lib/motion";

// 05 — "The Kingboard remembers every reign." Hero: remembers.
// Rows scroll up through months; the current King row elevation-lifts with gold edge light;
// past Kings stay dimmed. Slow push.
const ROWS = [
  {month: "Oct 2026", name: "Arjun K.", handle: "arjun", initials: "AK", hue: 210, crown: true},
  {month: "Sep 2026", name: "Mira S.", handle: "mira", initials: "MS", hue: 320},
  {month: "Aug 2026", name: "Dev P.", handle: "dev", initials: "DP", hue: 150},
  {month: "Jul 2026", name: "Arjun K.", handle: "arjun", initials: "AK", hue: 210},
  {month: "Jun 2026", name: "Mira S.", handle: "mira", initials: "MS", hue: 320},
];

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useLogical();
  const dur = sceneDur(5);
  const lift = hitLocal(5, "remembers");        // 35
  const scroll = interpolate(f, [0, 60], [260, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  const liftS = spring({frame: Math.max(0, f - lift), fps, config: UI_SPRING});
  const cam = interpolate(f, [0, dur], [1, 1.04], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});

  return (
    <Stage dur={dur} grainOpacity={0.04} watermark spotlightX={30}>
      <AbsoluteFill style={{opacity: exitOpacity(f, dur, 12)}}>
        <div style={{position: "absolute", left: 120, top: 330, width: 620}}>
          <WordReveal text="The Kingboard remembers." start={26} stagger={5} size={100} align="left" accent={{words: ["remembers."], color: "#F5C542"}} />
        </div>
        <BrowserFrame width={880} height={640} style={{left: 900, top: 220, transform: "perspective(2400px) rotateY(-5deg)"}} perspective={false}>
          <div style={{position: "absolute", inset: 0, background: ui.bg, padding: 30, boxSizing: "border-box", overflow: "hidden"}}>
            <div style={{fontFamily: "Inter, sans-serif", fontSize: 26, fontWeight: 700, color: ui.text, marginBottom: 6}}>Kingboard</div>
            <div style={{fontFamily: "Inter, sans-serif", fontSize: 14, color: ui.muted, marginBottom: 22}}>Current category winners and competition history</div>
            <div style={{position: "relative", height: 500}}>
              {ROWS.map((r, i) => {
                const isCurrent = i === 0;
                return (
                  <div key={r.month} style={{position: "absolute", left: 0, right: 0, top: i * 98 + scroll}}>
                    <KingRow month={r.month} name={r.name} handle={r.handle} initials={r.initials} hue={r.hue} crown={r.crown} width={820}
                      lift={isCurrent ? liftS : 0} dim={isCurrent ? 0 : 0.5} />
                  </div>
                );
              })}
            </div>
          </div>
        </BrowserFrame>
        <SoundCue frame={lift} src="sfx/shimmer.wav" volume={0.5} />
      </AbsoluteFill>
    </Stage>
  );
};
