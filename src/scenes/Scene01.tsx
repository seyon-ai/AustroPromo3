import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, } from "remotion";
import {useLogical} from "../lib/logical";
import {Stage} from "../components/Stage";
import {PostCard} from "../components/UI";
import {WordReveal} from "../components/Text";
import {motionTime, easeInOut, easeIn, ramp} from "../lib/motion";
import {hitLocal, sceneDur, exitOpacity} from "../lib/scene";
import {easeOut} from "../lib/motion";

// 01 — "Everyone's posting. Nobody's competing." Hero: competing.
// Feed cards already in motion on frame 0, speed-ramped, then freeze and pull back into depth.
const POSTS = [
  ["Arjun K.", "arjun", "AK", "Cities should price car lanes like parking.", "Urban"],
  ["Mira S.", "mira", "MS", "Open-source grants beat sponsorship deals.", "Technology"],
  ["Dev P.", "dev", "DP", "Schools should teach negotiation before algebra.", "Society"],
  ["Arjun K.", "arjun", "AK", "Public libraries are the last free arena.", "Culture"],
  ["Mira S.", "mira", "MS", "Solar roads lose to rooftops on cost per watt.", "Science"],
  ["Dev P.", "dev", "DP", "Founders should publish their post-mortems.", "Business"],
];

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useLogical();
  const hit = hitLocal(1, "competing");          // 66
  const dur = sceneDur(1);
  // speed ramp: accelerate into the freeze (quadratic), then hold (R6)
  const t = Math.min(f, hit) / hit;
  const scroll = t * t * 900;
  const frozen = f >= hit ? scroll : scroll;
  const pull = interpolate(f, [hit, hit + 44], [1.55, 0.78], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});
  const desat = interpolate(f, [hit, hit + 22], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIn});
  const dim = interpolate(f, [hit + 4, hit + 26], [0, 0.55], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const headlineIn = interpolate(f, [hit + 2, hit + 16], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});

  // depth grid: 3 rows x 2 columns of cards, each with its own speed & depth
  const cards = Array.from({length: 18}, (_, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const depth = row / 2; // 0 near … 1 far
    const speed = 0.7 + ((col * 37) % 11) / 20;
    return {i, col, row, depth, speed};
  });

  return (
    <Stage dur={dur} grainOpacity={0.04} watermark>
      <AbsoluteFill style={{opacity: exitOpacity(f, dur, 10)}}>
        <AbsoluteFill style={{transform: `scale(${pull})`, transformOrigin: "50% 50%", filter: `blur(${2 + 4 * (1 - pull / 1.55)}px) grayscale(${desat})`}}>
          {cards.map((c) => {
            const y = 140 + c.row * 300 - scroll * c.speed * (1 - c.depth * 0.35);
            const z = 1 - c.depth * 0.3;
            return (
              <div key={c.i} style={{position: "absolute", left: 180 + c.col * 260 - (c.row % 2) * 90, top: ((y % 1500) + 1500) % 1500 - 260, transform: `scale(${z})`, transformOrigin: "50% 50%", opacity: 1 - c.depth * 0.45, filter: `blur(${2 + c.depth * 6}px)`}}>
                <PostCard name={POSTS[c.i % 6][0]} handle={POSTS[c.i % 6][1]} initials={POSTS[c.i % 6][2]} hue={(c.i * 47) % 360} title={POSTS[c.i % 6][3]} category={POSTS[c.i % 6][4]} width={560} />
              </div>
            );
          })}
        </AbsoluteFill>
        <AbsoluteFill style={{background: `rgba(6,6,10,${dim})`}} />
        <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
          <div style={{opacity: headlineIn, transform: `translateY(${(1 - headlineIn) * 14}px)`}}>
            <WordReveal text="Nobody's competing." start={hit + 2} stagger={6} size={width > height ? 132 : 120} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Stage>
  );
};
