import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {Stage} from "../components/Stage";
import {Logo} from "../components/Logo";
import {Wordmark, SiteUrl} from "../components/Text";
import {Bloom, Flare, Flash, Chroma} from "../components/Effects";
import {SoundCue} from "../components/Sound";
import {easeIn, motionTime} from "../lib/motion";
import {hitLocal, sceneDur} from "../lib/scene";
import {SITE_URL} from "../theme";

// 10 — "Stop scrolling. Start clashing. AustroClash." Heroes: scrolling, clashing, AustroClash.
// PEAK 2. Cut from black → two slams → both fall away → logo lockup (text-as-mask light) →
// swell → freeze → hold 2.5 s. Grain fades last. Nothing after the lockup.
const SLAM1 = hitLocal(10, "scrolling");   // 33
const SLAM2 = hitLocal(10, "clashing");    // 84
const LOCK = hitLocal(10, "AustroClash");  // 120

export const Scene10: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const dur = sceneDur(10);
  const vw = width > height;
  const freezes = [{at: LOCK, len: 8}];
  const m = motionTime(f, freezes);

  const blackA = f < 4 ? 1 : 0;
  // slams: overshoot scale, then both fall away with ease-in (R2)
  const slamS1 = spring({frame: Math.max(0, m - SLAM1), fps, config: {damping: 11, stiffness: 240}});
  const slamS2 = spring({frame: Math.max(0, m - SLAM2), fps, config: {damping: 11, stiffness: 240}});
  const fall = interpolate(m, [108, 126], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIn});
  const slamOpacity = (s: number, start: number) => (m >= start ? Math.min(1, s) * (1 - fall) : 0);

  // lockup
  const logoS = spring({frame: Math.max(0, m - LOCK), fps, config: {damping: 12, stiffness: 170}});
  const logoScale = interpolate(logoS, [0, 1], [1.5, 1]);
  const logoOpacity = interpolate(m, [LOCK - 3, LOCK + 3], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const glow = `drop-shadow(0 0 48px rgba(245,197,66,0.22)) drop-shadow(-12px 0 32px rgba(124,92,255,0.15))`;
  const siteOpacity = interpolate(f, [LOCK + 30, LOCK + 50], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const grain = interpolate(f, [dur - 42, dur], [0.045, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const swell = interpolate(f, [LOCK, LOCK + 60], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  const lockupSize = vw ? 300 : 260;

  return (
    <Stage grainOpacity={grain} spotlightX={50}>
      <AbsoluteFill style={{background: `rgba(6,6,10,${blackA})`}} />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
        <div style={{position: "absolute", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 132, letterSpacing: "-0.03em", color: "#F5F5F7", lineHeight: 0.98, transform: `translateY(-110px) scale(${interpolate(slamS1, [0, 1], [1.25, 1])})`, opacity: slamOpacity(slamS1, SLAM1) * (m < LOCK ? 1 : 0)}}>
          Stop scrolling.
        </div>
        <div style={{position: "absolute", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 132, letterSpacing: "-0.03em", color: "#F5F5F7", lineHeight: 0.98, transform: `translateY(110px) scale(${interpolate(slamS2, [0, 1], [1.25, 1])})`, opacity: slamOpacity(slamS2, SLAM2) * (m < LOCK ? 1 : 0)}}>
          Start clashing.
        </div>

        {m >= LOCK - 6 ? (
          <div style={{position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 46, opacity: logoOpacity, filter: glow}}>
            <Chroma at={LOCK} len={4}>
              <div style={{transform: `scale(${logoScale})`}}>
                <Logo size={lockupSize} color="#F5F5F7" />
              </div>
            </Chroma>
            <Wordmark start={LOCK + 4} size={vw ? 84 : 72} sweep sweepStart={LOCK + 10} />
            <div style={{opacity: siteOpacity}}>
              <SiteUrl size={26} />
            </div>
          </div>
        ) : null}
        <Flash at={LOCK} len={6} max={0.2} />
        <Flare at={LOCK} len={4} y={50} max={0.33} color="#F5C542" />
        <Bloom at={LOCK} len={16} max={0.35} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, rgba(245,197,66,${0.10 * swell}) 0%, rgba(0,0,0,0) 60%)`, pointerEvents: "none"}} />
      <SoundCue frame={LOCK} src="sfx/impact.wav" volume={0.7} />
    </Stage>
  );
};
