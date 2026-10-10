import React from "react";
import {useCurrentFrame} from "remotion";
import {rnd} from "../lib/motion";

/**
 * Particle burst: N gold particles, per-particle seeded velocity, gravity, drag, fade.
 * All positions are pure functions of frame (deterministic).
 */
export const ParticleBurst: React.FC<{at: number; x: number; y: number; n?: number; color?: string; speed?: number; gravity?: number; drag?: number; life?: number}> = ({
  at, x, y, n = 72, color = "#F5C542", speed = 22, gravity = 0.9, drag = 0.06, life = 46,
}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > life) return null;
  return (
    <svg style={{position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none"}}>
      {Array.from({length: n}).map((_, i) => {
        const a = rnd(i * 3 + 1) * Math.PI * 2;
        const v = speed * (0.45 + rnd(i * 3 + 2) * 0.8);
        const vx = Math.cos(a) * v;
        const vy = Math.sin(a) * v - 4;
        const k = drag;
        const dx = (vx * (1 - Math.exp(-k * t))) / k;
        const dy = (vy * (1 - Math.exp(-k * t))) / k + 0.5 * gravity * t * t * 0.08;
        const o = Math.max(0, 1 - t / life);
        const r = 1.6 + rnd(i * 3 + 3) * 2.6;
        return <circle key={i} cx={x + dx} cy={y + dy} r={r} fill={color} opacity={o} />;
      })}
    </svg>
  );
};
