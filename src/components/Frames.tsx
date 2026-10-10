import React from "react";
import {SITE_URL, ui} from "../theme";

/** Floating browser frame: 24px radius, 1px rgba(255,255,255,0.1) border, top reflection, deep shadow. */
export const BrowserFrame: React.FC<{width: number; height: number; children: React.ReactNode; rotate?: number; perspective?: boolean; style?: React.CSSProperties}> = ({
  width, height, children, rotate = 0, perspective = true, style,
}) => (
  <div style={{position: "absolute", width, height, transform: `${perspective ? "perspective(2400px) " : ""}rotateX(${rotate}deg)`, transformStyle: "preserve-3d", ...style}}>
    <div style={{position: "absolute", inset: 0, borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)", background: ui.bg, overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,0.6)"}}>
      <div style={{height: 46, background: "#EDEDED", display: "flex", alignItems: "center", padding: "0 18px", gap: 8, borderBottom: "1px solid #DADADA"}}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
        ))}
        <div style={{marginLeft: 22, height: 26, borderRadius: 13, background: "#FFFFFF", flex: 1, maxWidth: 520, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: "Inter, sans-serif", fontSize: 14, color: ui.muted}}>
          {SITE_URL}
        </div>
      </div>
      <div style={{position: "absolute", inset: "46px 0 0 0"}}>{children}</div>
      <div style={{position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 22%)", pointerEvents: "none"}} />
    </div>
  </div>
);

/** Phone frame for mobile moments. */
export const PhoneFrame: React.FC<{width: number; height: number; children: React.ReactNode; style?: React.CSSProperties}> = ({width, height, children, style}) => (
  <div style={{position: "absolute", width, height, borderRadius: 56, background: "#0B0B0F", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 60px 120px rgba(0,0,0,0.6)", padding: 14, boxSizing: "border-box", ...style}}>
    <div style={{position: "relative", width: "100%", height: "100%", borderRadius: 42, overflow: "hidden", background: ui.bg}}>
      <div style={{position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 120, height: 32, borderRadius: 16, background: "#000", zIndex: 5}} />
      {children}
    </div>
  </div>
);
