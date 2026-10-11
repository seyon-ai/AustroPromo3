import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from "remotion";
import {useLogical} from "../lib/logical";
import {Stage} from "../components/Stage";
import {Logo} from "../components/Logo";
import {Wordmark, SiteUrl} from "../components/Text";
import {Bloom, Flare, Flash, Chroma, Ghosts} from "../components/Effects";
import {SoundCue} from "../components/Sound";
import {easeIn, easeOut, HERO_SPRING, motionTime} from "../lib/motion";
import {hitLocal, sceneDur} from "../lib/scene";

// 10 — "Stop scrolling. Start clashing. AustroClash." Heroes: scrolling, clashing, AustroClash.
// PEAK 2. Cut from black → two hero slams (ghost-trailed) → both fall away → logo lockup
// (text-as-mask light) → swell → freeze → hold 2.5 s. Grain fades last. Nothing after the lockup.
const SLAM1 = hitLocal(10, "scrolling");   // hero visual frame
const SLAM2 = hitLocal(10, "clashing");
const LOCK = hitLocal(10, "AustroClash");
const FALL = LOCK - 14;

const fallAt = (mo: number) =>
  interpolate(mo, [FALL, FALL + 18], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIn});

const WORDS = [
  {t: "Stop scrolling.", start: SLAM1, y: -110},
  {t: "Start clashing.", start: SLAM2, y: 110},
];

export const Scene10: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useLogical();
  const dur = sceneDur(10);
  const vw = width > height;
  const m = motionTime(f, [{at: LOCK, len: 8}]); // freeze 8 f on the final AustroClash

  const blackA = f < 4 ? 1 : 0;
  const logoS = spring({frame: Math.max(0, m - LOCK), fps, config: HERO_SPRING});
  const logoScale = interpolate(logoS, [0, 1], [1.5, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  const logoOpacity = interpolate(m, [LOCK - 3, LOCK + 3], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  const glow = "drop-shadow(0 0 48px rgba(245,197,66,0.22)) drop-shadow(-12px 0 32px rgba(124,92,255,0.15))";
  const siteOpacity = interpolate(f, [LOCK + 30, LOCK + 50], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  const grain = interpolate(f, [dur - 42, dur], [0.04, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  const swell = interpolate(f, [LOCK, LOCK + 60], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  const lockupSize = vw ? 300 : 260;

  return (
    <Stage dur={dur} grainOpacity={grain} spotlightX={50}>
      <AbsoluteFill style={{background: `rgba(6,6,10,${blackA})`}} />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
        {WORDS.map((w) => (
          <Ghosts key={w.t} active={m >= w.start && m < w.start + 10}>
            {(o: number) => {
              const mo = m - o;
              const s = spring({frame: Math.max(0, mo - w.start), fps, config: HERO_SPRING});
              const sc = interpolate(s, [0, 1], [1.25, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
              const op = (mo >= w.start ? Math.min(1, s) : 0) * (1 - fallAt(mo)) * (mo < LOCK ? 1 : 0);
              return (
                <div
                  style={{
                    position: "absolute", left: 0, right: 0, top: "50%", textAlign: "center",
                    fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 132, letterSpacing: "-0.03em",
                    color: "#F5F5F7", lineHeight: 0.98,
                    transform: `translateY(calc(-50% + ${w.y}px)) scale(${sc})`, opacity: op,
                  }}
                >
                  {w.t}
                </div>
              );
            }}
          </Ghosts>
        ))}

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
