import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {Stage} from "../components/Stage";
import {BrowserFrame} from "../components/Frames";
import {PointsBalance, RefereeCard, SignatureBlock, StoreItem} from "../components/UI";
import {WordReveal} from "../components/Text";
import {SoundCue} from "../components/Sound";
import {easeInOut, easeOut} from "../lib/motion";
import {hitLocal, sceneDur, exitOpacity} from "../lib/scene";

// 09 — "Dress your identity in the Austro Store. Sign it with your AustroSignature.
//        Spend AustroPoints. And let the AI Referee keep it fair."
// Beat-cuts: Store item light sweep → signature line draw → AustroPoints count-up → AI Referee scan-line.
const CUT_B = 100;   // "Austro Store."
const CUT_C = 180;   // "AustroSignature."
const CUT_D = 238;   // "AustroPoints."
const CUT_E = 308;   // "AI Referee."
const STORE_HERO = hitLocal(9, "Store");              // 100
const SIG_HERO = hitLocal(9, "AustroSignature");      // 180
const POINTS_HERO = hitLocal(9, "AustroPoints");      // 238
const REF_HERO = hitLocal(9, "Referee");              // 308

const Headline: React.FC<{text: string; start: number; accent?: string}> = ({text, start, accent}) => {
  const {width, height} = useVideoConfig();
  return (
    <div style={{position: "absolute", left: 120, top: 300, width: 760}}>
      <WordReveal text={text} start={start} stagger={5} size={width > height ? 108 : 96} align="left" accent={accent ? {words: [accent], color: "#FFFFFF"} : undefined} />
    </div>
  );
};

export const Scene09: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = sceneDur(9);
  const cam = interpolate(f, [0, dur], [1, 1.04], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});
  const inA = f < CUT_B, inB = f >= CUT_B && f < CUT_C, inC = f >= CUT_C && f < CUT_D, inD = f >= CUT_D && f < CUT_E, inE = f >= CUT_E;

  // A: store item light sweep, landing at the word "Store"
  const sweep = interpolate(f, [40, STORE_HERO - 4], [-40, 140], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});
  const itemS = spring({frame: Math.max(0, f - 2), fps, config: {damping: 16, stiffness: 140}});

  // B: store row (same product family)
  // C: signature line draw leads to the AustroSignature hero
  const drawn = interpolate(f, [CUT_C - 60, SIG_HERO + 2], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});

  // D: AustroPoints count-up, eased with slow tail
  const countT = interpolate(f, [POINTS_HERO - 4, POINTS_HERO + 52], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3)});
  const points = Math.round(1250 * countT);

  // E: scan line + one calm pulse
  const scanY = interpolate(f, [REF_HERO, REF_HERO + 46], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});
  const pulse = interpolate(f, [REF_HERO + 46, REF_HERO + 70, REF_HERO + 96], [0, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});

  return (
    <Stage grainOpacity={0.045} watermark spotlightX={60} camera={cam}>
      <AbsoluteFill style={{opacity: exitOpacity(f, dur, 12)}}>
        {inA ? (
          <>
            <Headline text="Dress your identity." start={6} />
            <div style={{position: "absolute", right: 170, top: 240, opacity: Math.min(1, itemS * 1.3), transform: `translateY(${(1 - itemS) * 60}px)`}}>
              <StoreItem width={520} name="Gold Arena Frame" price="Store cosmetic" sweep={sweep} hue={45} />
            </div>
          </>
        ) : null}
        {inB ? (
          <>
            <Headline text="Austro Store." start={STORE_HERO - 4} accent="Store." />
            <div style={{position: "absolute", right: 170, top: 200, display: "flex", gap: 24}}>
              <StoreItem width={300} name="Violet Trail" price="Store cosmetic" sweep={60} hue={260} />
              <StoreItem width={300} name="Ember Ring" price="Store cosmetic" sweep={-40} hue={15} />
            </div>
          </>
        ) : null}
        {inC ? (
          <>
            <Headline text="AustroSignature." start={SIG_HERO - 4} accent="AustroSignature." />
            <div style={{position: "absolute", right: 170, top: 340}}>
              <SignatureBlock width={700} name="Arjun K. · personal signature" drawn={drawn} />
            </div>
          </>
        ) : null}
        {inD ? (
          <>
            <Headline text="AustroPoints." start={POINTS_HERO - 4} accent="AustroPoints." />
            <div style={{position: "absolute", right: 170, top: 330}}>
              <PointsBalance width={560} value={points} />
            </div>
          </>
        ) : null}
        {inE ? (
          <>
            <Headline text="AI Referee." start={REF_HERO - 4} accent="Referee." />
            <div style={{position: "absolute", right: 170, top: 300, transform: `scale(${1 + 0.01 * pulse})`}}>
              <RefereeCard width={640} scanY={scanY} lit={pulse} />
            </div>
          </>
        ) : null}

        <SoundCue frame={0} src="sfx/whoosh.wav" volume={0.5} />
        <SoundCue frame={CUT_B} src="sfx/whoosh.wav" volume={0.45} />
        <SoundCue frame={CUT_C} src="sfx/whoosh.wav" volume={0.45} />
        <SoundCue frame={CUT_D} src="sfx/whoosh.wav" volume={0.45} />
        <SoundCue frame={CUT_E} src="sfx/whoosh.wav" volume={0.45} />
        <SoundCue frame={STORE_HERO - 4} src="sfx/shimmer.wav" volume={0.5} />
      </AbsoluteFill>
    </Stage>
  );
};
