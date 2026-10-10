import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {Stage} from "../components/Stage";
import {Logo} from "../components/Logo";
import {PostCard} from "../components/UI";
import {Wordmark, WordReveal} from "../components/Text";
import {Flare, Bloom, Flash, Chroma} from "../components/Effects";
import {motionTime, easeOut, rnd} from "../lib/motion";
import {hitLocal, sceneDur, exitOpacity} from "../lib/scene";

// 02 — "AustroClash. Where ideas go to fight." Hero: fight.
// Shatter entrance (vocab 17) → logo emergence (R9) → letter wipe wordmark → freeze on "fight".
const IMPACT = 20;   // logo slam (R6 freeze follows)
const FIGHT = hitLocal(2, "fight"); // 106

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const dur = sceneDur(2);
  const freezes = [{at: IMPACT, len: 8}, {at: FIGHT, len: 8}];
  const m = motionTime(f, freezes);
  const vw = width > height;

  // --- shatter: card splits into 8 fragments flying outward (0 → 16)
  const shatterT = interpolate(f, [0, 16], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  const fragments = Array.from({length: 8}, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + rnd(i) * 0.6;
    const d = 420 + rnd(i + 9) * 260;
    return {i, dx: Math.cos(a) * d, dy: Math.sin(a) * d, rot: (rnd(i + 3) - 0.5) * 80};
  });
  const shatterOn = f < 18;

  // --- logo pieces (viewBox units; 1 unit = size/100 px). Logo size 340px.
  const size = 340;
  const u = size / 100;
  const topStart = 12, botStart = 15, diaStart = 20;
  const topS = spring({frame: Math.max(0, m - topStart), fps, config: {damping: 12, stiffness: 170}});
  const botS = spring({frame: Math.max(0, m - botStart), fps, config: {damping: 12, stiffness: 170}});
  const diaS = spring({frame: Math.max(0, m - diaStart), fps, config: {damping: 9, stiffness: 180}});
  const topOff = (1 - topS) * -120 / u;
  const botOff = (1 - botS) * 120 / u;
  const diaScale = m < diaStart ? 0 : diaS;

  // --- wordmark: letter wipe starts 26, text-as-mask light sweep 50
  const wmStart = 26;
  const tagStart = FIGHT - 48; // sentence words land on their beats

  const logoVisible = f >= topStart - 2;
  const showWordmark = f >= wmStart;

  return (
    <Stage grainOpacity={0.045} watermark spotlightX={50}>
      <AbsoluteFill style={{opacity: exitOpacity(f, dur, 12)}}>
        {/* shattered card */}
        {shatterOn ? (
          <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
            {fragments.map((fr) => {
              const p = shatterT;
              return (
                <div key={fr.i} style={{position: "absolute", width: 620, height: 260, clipPath: `polygon(${(fr.i * 13) % 40}% 0%, 100% ${(fr.i * 17) % 40}%, ${60 + (fr.i * 7) % 40}% 100%, 0% ${50 + (fr.i * 11) % 40}%)`, transform: `translate(${fr.dx * p}px, ${fr.dy * p}px) rotate(${fr.rot * p}deg)`, filter: `blur(${p * 8}px)`, opacity: 1 - p * 0.9}}>
                  <div style={{position: "absolute", left: -310, top: -130}}>
                    <PostCard name="Arjun K." handle="arjun" initials="AK" title="Ideas that survive a public vote are the ones worth building." body="Post it, defend it, and let the Arena decide." width={620} />
                  </div>
                </div>
              );
            })}
          </AbsoluteFill>
        ) : null}

        {/* logo emergence */}
        {logoVisible ? (
          <Chroma at={IMPACT} len={4}>
            <AbsoluteFill style={{alignItems: "center", justifyContent: "center", transform: "translateY(-100px)"}}>
              <Logo size={size} top={topOff} bottom={botOff} diamondScale={diaScale} />
            </AbsoluteFill>
          </Chroma>
        ) : null}

        {showWordmark ? (
          <AbsoluteFill style={{alignItems: "center", justifyContent: "center", transform: "translateY(200px)"}}>
            <Wordmark start={wmStart} size={vw ? 96 : 76} sweep sweepStart={50} />
          </AbsoluteFill>
        ) : null}

        <AbsoluteFill style={{alignItems: "center", justifyContent: "flex-end", paddingBottom: 150}}>
          <WordReveal text="Where ideas go to fight." start={FIGHT - 48} stagger={12} size={vw ? 58 : 50} accent={{words: ["fight."], color: "#FFFFFF"}} />
        </AbsoluteFill>

        <Flash at={IMPACT} len={6} max={0.25} />
        <Flare at={IMPACT} len={4} y={38} max={0.3} />
        <Flare at={FIGHT} len={4} y={62} max={0.22} />
        <Bloom at={IMPACT} len={12} max={0.35} y={38} />
        <Bloom at={FIGHT} len={10} max={0.25} />
      </AbsoluteFill>
    </Stage>
  );
};
