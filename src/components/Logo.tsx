import React from "react";
import {LOGO_PATHS} from "../logoPaths";

/**
 * Official mark, traced from public/logo.png by scripts/make_logo.py (viewBox 0 0 100 100).
 * Three pieces: topChevron, diamond, bottomChevron. Offsets are in viewBox units.
 */
export const Logo: React.FC<{
  size: number;
  color?: string;
  top?: number;          // top chevron Y offset (units)
  bottom?: number;       // bottom chevron Y offset (units)
  diamondScale?: number; // diamond scale around its centre
  style?: React.CSSProperties;
}> = ({size, color = "#F5F5F7", top = 0, bottom = 0, diamondScale = 1, style}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: "visible", display: "block", ...style}}>
    <path d={LOGO_PATHS.topChevron} fill={color} transform={`translate(0 ${top})`} />
    <path
      d={LOGO_PATHS.diamond}
      fill={color}
      transform={`translate(50 50) scale(${diamondScale}) translate(-50 -50)`}
    />
    <path d={LOGO_PATHS.bottomChevron} fill={color} transform={`translate(0 ${bottom})`} />
  </svg>
);
