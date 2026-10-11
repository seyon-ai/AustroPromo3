import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, } from "remotion";
import {useLogical} from "../lib/logical";
import {Stage} from "../components/Stage";
import {BrowserFrame} from "../components/Frames";
import {ArenaTile, Header, KingBadge, PostCard, Sidebar, VoteControl} from "../components/UI";
import {Bloom, Flare, Ghosts} from "../components/Effects";
import {ParticleBurst} from "../components/Particles";
import {SoundCue} from "../components/Sound";
import {easeInOut, easeOut, motionTime, HERO_SPRING} from "../lib/motion";
import {hitLocal, sceneDur, exitOpacity} from "../lib/scene";
import {ui} from "../theme";
import {UI_SPRING} from "../lib/motion";

// 04 — "Every month, the post with the most votes wins — and its author is crowned King." Hero: King.
// PEAK 1. Zoom into the tile → vote control fills with overshoot → count-up → KING badge drops with
// impact → particle burst → flare + bloom → freeze (R6). Gold is allowed here.
export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useLogical();
  const dur = sceneDur(4);
  const KING = hitLocal(4, "King");            // 175
  const freezes = [{at: KING, len: 8}];
  const m = motionTime(f, freezes);

  // browser zooms slowly into the Technology tile + right-hand post
  const zoom = interpolate(m, [0, 90], [1.0, 1.1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut});

  // vote control: fill with spring overshoot; count-up (eased, last digits slow)
  const fill = spring({frame: Math.max(0, m - 18), fps, config: UI_SPRING}) * 0.84;
  const countT = interpolate(m, [18, 150], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  const count = Math.round(412 * countT);

  // KING badge drop with anticipation (−4px counter-move), impact at KING frame
  const dropStart = KING - 5;
  const dropS = spring({frame: Math.max(0, m - dropStart), fps, config: HERO_SPRING});
  const dropY = interpolate(dropS, [0, 1], [-260, 0], {easing: easeOut});
  const badgeOpacity = m >= dropStart ? 1 : 0;

  // post card lifts after the crown lands
  const cardLift = interpolate(m, [KING, KING + 40], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});

  return (
    <Stage dur={dur} grainOpacity={0.04} spotlightX={50}>
      <AbsoluteFill style={{opacity: exitOpacity(f, dur, 12)}}>
        <BrowserFrame width={1500} height={780} style={{left: 210, top: 150, transform: `perspective(2400px) scale(${zoom})`}} perspective={false}>
          <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column"}}>
            <Header width={1500} active="Arena" compact />
            <div style={{display: "flex", flex: 1}}>
              <Sidebar width={200} active="Arena" />
              <div style={{flex: 1, padding: 34, boxSizing: "border-box", display: "flex", gap: 34, position: "relative"}}>
                <div style={{display: "flex", flexDirection: "column", gap: 20}}>
                  <ArenaTile name="Technology" sub="October arena · voting open" width={300} height={190} active />
                  <ArenaTile name="Science" sub="Evidence first" width={300} height={150} blur={1} />
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: 22, position: "relative"}}>
                  <div style={{transform: `translateY(${-cardLift * 6}px) scale(${1 + 0.02 * cardLift})`, filter: `drop-shadow(0 ${20 * cardLift}px ${40 * cardLift}px rgba(0,0,0,${0.25 * cardLift}))`}}>
                    <PostCard name="Arjun K." handle="arjun" initials="AK" hue={210} title="Cities should price car lanes like they price parking." body="Market-based curb pricing funds transit and clears traffic. Vote for the argument that holds up." category="Technology" width={720} highlight />
                  </div>
                  <VoteControl fill={fill} count={count} label="Valid votes" width={720} />
                  <Ghosts active={f >= dropStart && f < dropStart + 12}>
                    {(o: number) => {
                      const mo = m - o;
                      const ds = spring({frame: Math.max(0, mo - dropStart), fps, config: HERO_SPRING});
                      const dy = interpolate(ds, [0, 1], [-260, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
                      return (
                        <div style={{position: "absolute", left: 176, top: 20, transform: `translateY(${dy}px)`, opacity: mo >= dropStart ? 1 : 0}}>
                          <KingBadge scale={1.8} />
                        </div>
                      );
                    }}
                  </Ghosts>
                </div>
              </div>
            </div>
          </div>
        </BrowserFrame>

        {/* gold accents for the crown beat */}
        <ParticleBurst at={KING} x={1080} y={300} n={72} speed={24} drag={0.07} life={48} />
        <Bloom at={KING} len={12} max={0.45} x={62} y={36} />
        <Flare at={KING} len={4} y={34} max={0.3} color="#F5C542" />
        <SoundCue frame={KING} src="sfx/impact.wav" volume={0.6} />
      </AbsoluteFill>
    </Stage>
  );
};
