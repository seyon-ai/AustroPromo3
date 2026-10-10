// Code replicas of the real AustroClash UI (light theme, sampled from the product screenshot).
// Sample names are placeholders (Arjun K., Mira S., Dev P.). Vote numbers are illustrative only.
import React from "react";
import {UI} from "../fonts";
import {ui} from "../theme";
import {Logo} from "./Logo";

const base: React.CSSProperties = {fontFamily: UI, color: ui.text, fontWeight: 500, whiteSpace: "nowrap"};

export const Icon: React.FC<{d: string; size?: number; color?: string; stroke?: number; fill?: string}> = ({d, size = 18, color = ui.text, stroke = 2, fill = "none"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
export const ICON = {
  home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  layers: "M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5m-18 4l9 5 9-5",
  compass: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm4-14l-2.5 6.5L8 16l2.5-6.5L16 8z",
  crown: "M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z",
  lock: "M7 11V8a5 5 0 0 1 10 0v3m-11 0h12v10H6z",
  check: "M5 12l4.5 4.5L19 7",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8m5 12a2 2 0 0 0 4 0",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.3-4.3",
  message: "M4 5h16v11H8l-4 4z",
  users: "M16 14a4 4 0 1 0-8 0m-3 6a7 7 0 0 1 14 0M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  bag: "M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2",
  pen: "M4 20h4L19 9l-4-4L4 16z",
  arrowUp: "M12 19V5m-6 6l6-6 6 6",
  arrow: "M5 12h14m-6-6l6 6-6 6",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
};

export const Avatar: React.FC<{initials: string; size?: number; hue?: number; ring?: string}> = ({initials, size = 40, hue = 260, ring}) => (
  <div
    style={{
      width: size, height: size, borderRadius: size / 2, flexShrink: 0,
      background: `linear-gradient(135deg, hsl(${hue} 80% 62%), hsl(${(hue + 60) % 360} 75% 45%))`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontFamily: UI, fontWeight: 600, fontSize: size * 0.36,
      boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
    }}
  >
    {initials}
  </div>
);

/** KING badge exactly as in the product: amber text on pale amber pill. */
export const KingBadge: React.FC<{scale?: number}> = ({scale = 1}) => (
  <div style={{...base, display: "inline-flex", alignItems: "center", gap: 6, height: 26 * scale, padding: `0 ${10 * scale}px`, borderRadius: 8, background: ui.goldSoft, border: "1px solid #F3E2A6", color: ui.kingGold, fontSize: 12 * scale, fontWeight: 600, letterSpacing: "0.04em"}}>
    <Icon d={ICON.crown} size={13 * scale} color={ui.kingGold} stroke={2.2} />
    KING
  </div>
);

export const Chip: React.FC<{label: string; active?: boolean; scale?: number}> = ({label, active, scale = 1}) => (
  <div style={{...base, height: 34 * scale, padding: `0 ${16 * scale}px`, borderRadius: 999, display: "inline-flex", alignItems: "center", fontSize: 14 * scale, background: active ? ui.primary : ui.surface, color: active ? ui.primaryText : ui.text, border: `1px solid ${active ? ui.primary : ui.border}`}}>
    {label}
  </div>
);

export const PillButton: React.FC<{label: string; scale?: number; icon?: string; color?: string; bg?: string}> = ({label, scale = 1, icon, color = ui.primaryText, bg = ui.primary}) => (
  <div style={{...base, height: 38 * scale, padding: `0 ${18 * scale}px`, borderRadius: 999, background: bg, color, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15 * scale}}>
    {icon ? <Icon d={icon} size={15 * scale} color={color} /> : null}
    {label}
  </div>
);

/** Header nav, matching the screenshot order and pill style. */
export const Header: React.FC<{width: number; active?: string; compact?: boolean}> = ({width, active = "Feed", compact = false}) => {
  const items = ["Feed", "Arena", "Explore", "Clashes", "Squads", "Kingboard", "Red Tick"];
  return (
    <div style={{...base, width, height: 62, background: ui.surface, borderBottom: `1px solid ${ui.border}`, display: "flex", alignItems: "center", padding: "0 26px", gap: 22, boxSizing: "border-box"}}>
      <div style={{display: "flex", alignItems: "center", gap: 10}}>
        <Logo size={26} color={ui.text} />
        {compact ? null : <div style={{fontFamily: "Space Grotesk, Inter, sans-serif", fontWeight: 700, letterSpacing: "0.18em", fontSize: 17}}>AUSTROCLASH</div>}
      </div>
      <div style={{display: "flex", gap: 6}}>
        {items.map((it) => (
          <div key={it} style={{height: 32, padding: "0 12px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6, fontSize: 14, background: it === active ? ui.primary : "transparent", color: it === active ? ui.primaryText : ui.text}}>
            <span style={{width: 12, height: 12, borderRadius: 3, background: it === active ? "#FFFFFF" : "#D4D4D4", display: "inline-block"}} />
            {it}
          </div>
        ))}
      </div>
      <div style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: 14}}>
        <div style={{width: 210, height: 34, borderRadius: 999, background: ui.surfaceAlt, border: `1px solid ${ui.border}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 8, fontSize: 13, color: ui.muted}}>
          <Icon d={ICON.search} size={14} color={ui.muted} /> Search theses, users...
        </div>
        <PillButton label="Create Post" scale={0.85} />
      </div>
    </div>
  );
};

/** Sidebar with the exact item order from the product. */
export const Sidebar: React.FC<{width: number; active?: string}> = ({width, active = "Feed"}) => {
  const items: [string, string][] = [["Feed", ICON.home], ["Arena", ICON.layers], ["Explore", ICON.compass], ["Clashes", ICON.shield], ["Squads", ICON.users], ["Kingboard", ICON.crown], ["Red Tick", ICON.star], ["Allies & Friends", ICON.users], ["Direct Messages", ICON.message], ["Settings", ICON.pen]];
  return (
    <div style={{...base, width, background: ui.bg, padding: 18, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 4}}>
      {items.map(([label, d]) => (
        <div key={label} style={{height: 40, borderRadius: 12, padding: "0 14px", display: "flex", alignItems: "center", gap: 12, background: label === active ? ui.primary : "transparent", color: label === active ? ui.primaryText : ui.text, fontSize: 15}}>
          <Icon d={d} size={17} color={label === active ? ui.primaryText : ui.text} />
          {label}
          {label === "Red Tick" ? <span style={{marginLeft: "auto", fontSize: 10, color: ui.danger, background: ui.dangerSoft, padding: "2px 7px", borderRadius: 999, fontWeight: 600}}>PRO</span> : null}
        </div>
      ))}
    </div>
  );
};

/** Feed post card: author row, KING badge, clash + category tags, title, body. */
export const PostCard: React.FC<{name: string; handle: string; initials: string; hue?: number; title: string; body?: string; king?: boolean; category?: string; width?: number; highlight?: boolean}> = ({
  name, handle, initials, hue = 260, title, body, king, category = "Technology", width = 620, highlight,
}) => (
  <div style={{...base, width, background: ui.surface, borderRadius: 16, border: `1px solid ${highlight ? "#CFCFCF" : ui.border}`, padding: 22, boxSizing: "border-box", boxShadow: highlight ? "0 18px 40px rgba(0,0,0,0.12)" : "none"}}>
    <div style={{display: "flex", alignItems: "center", gap: 12}}>
      <Avatar initials={initials} size={44} hue={hue} />
      <div style={{display: "flex", flexDirection: "column", gap: 3}}>
        <div style={{display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 600}}>{name} {king ? <KingBadge scale={0.8} /> : null}</div>
        <div style={{fontSize: 13, color: ui.muted}}>@{handle} · Oct 2026</div>
      </div>
      <div style={{marginLeft: "auto", display: "flex", gap: 8}}>
        <Chip label="Clash" scale={0.8} />
        <Chip label={category} scale={0.8} />
      </div>
    </div>
    <div style={{marginTop: 16, fontSize: 22, lineHeight: 1.3, fontWeight: 700, fontFamily: UI, letterSpacing: "-0.01em"}}>{title}</div>
    {body ? <div style={{marginTop: 10, fontSize: 15, lineHeight: 1.55, color: "#4A4A4A"}}>{body}</div> : null}
  </div>
);

/** Vote control: fill bar + count. `fill` 0..1, `count` integer shown. */
export const VoteControl: React.FC<{fill: number; count: number; label?: string; width?: number}> = ({fill, count, label = "Votes", width = 520}) => (
  <div style={{...base, width, boxSizing: "border-box", background: ui.surface, border: `1px solid ${ui.border}`, borderRadius: 16, padding: 18}}>
    <div style={{display: "flex", justifyContent: "space-between", fontSize: 14, color: ui.muted}}>
      <span>{label}</span>
      <span style={{fontVariantNumeric: "tabular-nums", color: ui.text, fontWeight: 600, fontSize: 18}}>{count.toLocaleString("en-US")}</span>
    </div>
    <div style={{marginTop: 12, height: 12, borderRadius: 6, background: ui.surfaceAlt, overflow: "hidden"}}>
      <div style={{height: "100%", width: `${Math.max(0, fill) * 100}%`, background: ui.primary, borderRadius: 6}} />
    </div>
  </div>
);

/** Arena category tile. */
export const ArenaTile: React.FC<{name: string; sub: string; width?: number; height?: number; active?: boolean; blur?: number; glyph?: string}> = ({
  name, sub, width = 300, height = 180, active, blur = 0, glyph = ICON.layers,
}) => (
  <div style={{...base, width, height, boxSizing: "border-box", background: ui.surface, borderRadius: 18, border: `1px solid ${active ? ui.primary : ui.border}`, padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: active ? "0 26px 60px rgba(0,0,0,0.25)" : "0 2px 6px rgba(0,0,0,0.04)", filter: blur ? `blur(${blur}px)` : undefined}}>
    <div style={{width: 42, height: 42, borderRadius: 12, background: ui.primary, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Icon d={glyph} size={20} color="#fff" />
    </div>
    <div>
      <div style={{fontSize: 22, fontWeight: 700, fontFamily: UI}}>{name}</div>
      <div style={{fontSize: 14, color: ui.muted, marginTop: 4}}>{sub}</div>
    </div>
  </div>
);

/** Kingboard row. `lift` 0..1 (elevation), `dim` for past reigns. */
export const KingRow: React.FC<{name: string; handle: string; initials: string; month: string; crown?: boolean; width?: number; lift?: number; dim?: number; hue?: number; reigns?: string}> = ({
  name, handle, initials, month, crown, width = 900, lift = 0, dim = 0, hue = 260, reigns,
}) => (
  <div
    style={{
      ...base, width, height: 84, boxSizing: "border-box", background: ui.surface, borderRadius: 16, padding: "0 24px",
      display: "flex", alignItems: "center", gap: 18,
      border: `1px solid ${crown ? "#E9C86A" : ui.border}`,
      transform: `scale(${1 + 0.04 * lift})`,
      boxShadow: `0 ${10 + 26 * lift}px ${24 + 40 * lift}px rgba(0,0,0,${0.06 + 0.22 * lift})`,
      opacity: 1 - dim * 0.55,
      filter: dim ? `saturate(${1 - dim * 0.8})` : undefined,
    }}
  >
    <div style={{fontSize: 14, color: ui.muted, width: 80, fontWeight: 600}}>{month}</div>
    <Avatar initials={initials} size={46} hue={hue} />
    <div style={{display: "flex", flexDirection: "column", gap: 3}}>
      <div style={{fontSize: 18, fontWeight: 600}}>{name}</div>
      <div style={{fontSize: 13, color: ui.muted}}>@{handle}</div>
    </div>
    <div style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: 14}}>
      {reigns ? <div style={{fontSize: 13, color: ui.muted}}>{reigns}</div> : null}
      {crown ? <KingBadge /> : <div style={{fontSize: 13, color: ui.muted, padding: "5px 12px", borderRadius: 8, background: ui.surfaceAlt}}>Former King</div>}
    </div>
  </div>
);

/** Profile header with badges row. */
export const ProfileCard: React.FC<{width?: number; name: string; handle: string; initials: string; bio: string}> = ({width = 700, name, handle, initials, bio}) => (
  <div style={{...base, width, boxSizing: "border-box", background: ui.surface, borderRadius: 18, border: `1px solid ${ui.border}`, overflow: "hidden"}}>
    <div style={{height: 140, background: "linear-gradient(120deg, #1E1E26, #3A3A4A 60%, #5A5A6E)"}} />
    <div style={{padding: "0 26px 24px", marginTop: -48}}>
      <div style={{width: 96, height: 96, borderRadius: 48, border: "4px solid #FFFFFF", overflow: "hidden", display: "inline-flex"}}>
        <Avatar initials={initials} size={88} hue={210} />
      </div>
      <div style={{fontSize: 26, fontWeight: 700, fontFamily: UI, marginTop: 10}}>{name}</div>
      <div style={{fontSize: 15, color: ui.muted}}>@{handle}</div>
      <div style={{marginTop: 10, fontSize: 15, color: "#4A4A4A", lineHeight: 1.5}}>{bio}</div>
    </div>
  </div>
);

export const BadgeTile: React.FC<{label: string; hue: number; glyph?: string; width?: number; flip?: number}> = ({label, hue, glyph = ICON.star, width = 180, flip = 1}) => (
  <div
    style={{
      ...base, width, height: 170, boxSizing: "border-box", background: ui.surface, borderRadius: 18, border: `1px solid ${ui.border}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
      transform: `perspective(1200px) rotateY(${(1 - flip) * 90}deg)`, opacity: flip,
      backfaceVisibility: "hidden",
    }}
  >
    <div style={{width: 62, height: 62, borderRadius: 31, background: `linear-gradient(135deg, hsl(${hue} 80% 62%), hsl(${(hue + 40) % 360} 70% 42%))`, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Icon d={glyph} size={26} color="#fff" stroke={2.2} />
    </div>
    <div style={{fontSize: 15, fontWeight: 600}}>{label}</div>
  </div>
);

/** DM bubble, alternating sides. */
export const Bubble: React.FC<{text: string; mine?: boolean; scale?: number; opacity?: number; y?: number}> = ({text, mine, scale = 1, opacity = 1, y = 0}) => (
  <div style={{...base, display: "flex", justifyContent: mine ? "flex-end" : "flex-start", transform: `translateY(${y}px) scale(${scale})`, opacity}}>
    <div style={{maxWidth: "78%", padding: "12px 16px", borderRadius: 18, borderBottomRightRadius: mine ? 6 : 18, borderBottomLeftRadius: mine ? 18 : 6, background: mine ? ui.primary : ui.surface, color: mine ? ui.primaryText : ui.text, fontSize: 16, lineHeight: 1.4, border: mine ? "none" : `1px solid ${ui.border}`}}>{text}</div>
  </div>
);

export const TypingDots: React.FC<{frame: number}> = ({frame}) => (
  <div style={{display: "flex", gap: 6, padding: "12px 16px", background: ui.surface, border: `1px solid ${ui.border}`, borderRadius: 18, width: "fit-content"}}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{width: 8, height: 8, borderRadius: 4, background: ui.muted, opacity: 0.35 + 0.65 * (((frame - i * 5) % 18) < 9 ? 1 : 0.3)}} />
    ))}
  </div>
);

/** AUSTRO VAR need card. */
export const NeedCard: React.FC<{width?: number; title: string; body: string; tags: string[]}> = ({width = 760, title, body, tags}) => (
  <div style={{...base, width, boxSizing: "border-box", background: ui.surface, borderRadius: 18, border: "1px solid #D9CFFF", padding: 26, boxShadow: "0 30px 80px rgba(0,0,0,0.35)"}}>
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
      <div style={{fontSize: 13, fontWeight: 600, color: "#5B3FD9", letterSpacing: "0.06em"}}>AUSTRO VAR · NEED</div>
      <div style={{fontSize: 12, color: ui.muted}}>Value and Resource Arena</div>
    </div>
    <div style={{marginTop: 14, fontSize: 26, fontWeight: 700, fontFamily: UI}}>{title}</div>
    <div style={{marginTop: 10, fontSize: 16, lineHeight: 1.5, color: "#4A4A4A"}}>{body}</div>
    <div style={{marginTop: 16, display: "flex", gap: 8}}>{tags.map((t) => <Chip key={t} label={t} scale={0.85} />)}</div>
  </div>
);

export const ProviderReply: React.FC<{width?: number; name: string; initials: string; text: string; selected?: boolean; dim?: number; flip?: number; hue?: number}> = ({
  width = 760, name, initials, text, selected, dim = 0, flip = 1, hue = 280,
}) => (
  <div
    style={{
      ...base, width, boxSizing: "border-box", background: ui.surface, borderRadius: 16, padding: 20,
      border: `1.5px solid ${selected ? "#5B3FD9" : ui.border}`,
      display: "flex", gap: 16, alignItems: "flex-start",
      transform: `perspective(1200px) rotateY(${(1 - flip) * -80}deg)`, opacity: flip * (1 - dim * 0.6),
      filter: dim ? "saturate(0.2)" : undefined,
    }}
  >
    <Avatar initials={initials} size={46} hue={hue} />
    <div style={{flex: 1}}>
      <div style={{display: "flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 600}}>
        {name}
        {selected ? (
          <div style={{marginLeft: "auto", width: 26, height: 26, borderRadius: 13, background: "#5B3FD9", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Icon d={ICON.check} size={15} color="#fff" stroke={3} />
          </div>
        ) : null}
      </div>
      <div style={{marginTop: 6, fontSize: 15, lineHeight: 1.5, color: "#4A4A4A"}}>{text}</div>
    </div>
  </div>
);

export const StoreItem: React.FC<{width?: number; name: string; price: string; sweep?: number; hue?: number}> = ({width = 300, name, price, sweep = -40, hue = 45}) => (
  <div style={{...base, width, boxSizing: "border-box", background: ui.surface, borderRadius: 18, border: `1px solid ${ui.border}`, overflow: "hidden"}}>
    <div style={{height: 180, position: "relative", background: `linear-gradient(135deg, hsl(${hue} 80% 70%), hsl(${hue + 200} 60% 40%))`, overflow: "hidden"}}>
      <div style={{position: "absolute", top: "-20%", bottom: "-20%", width: "40%", left: `${sweep}%`, background: "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)", transform: "skewX(-18deg)"}} />
    </div>
    <div style={{padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <div style={{fontSize: 18, fontWeight: 600}}>{name}</div>
      <div style={{fontSize: 14, color: ui.muted}}>{price}</div>
    </div>
  </div>
);

export const SignatureBlock: React.FC<{width?: number; name: string; drawn: number}> = ({width = 620, name, drawn}) => {
  const L = 900;
  return (
    <div style={{...base, width, boxSizing: "border-box", background: ui.surface, borderRadius: 18, border: `1px solid ${ui.border}`, padding: 26}}>
      <div style={{fontSize: 13, color: ui.muted, fontWeight: 600, letterSpacing: "0.06em"}}>AUSTROSIGNATURE</div>
      <svg width="100%" height="120" viewBox="0 0 900 120" style={{marginTop: 10, display: "block"}}>
        <path
          d="M30 80 C 90 20, 130 110, 190 58 S 300 26, 340 74 S 430 100, 470 52 S 560 24, 610 70 S 720 102, 760 46 L 880 60"
          fill="none" stroke={ui.text} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={L} strokeDashoffset={L * (1 - drawn)}
        />
      </svg>
      <div style={{fontSize: 16, color: "#4A4A4A"}}>{name}</div>
    </div>
  );
};

export const PointsBalance: React.FC<{width?: number; value: number}> = ({width = 420, value}) => (
  <div style={{...base, width, boxSizing: "border-box", background: ui.surface, borderRadius: 18, border: `1px solid ${ui.border}`, padding: 26}}>
    <div style={{fontSize: 13, color: ui.muted, fontWeight: 600, letterSpacing: "0.06em"}}>AUSTROPOINTS BALANCE</div>
    <div style={{marginTop: 10, fontSize: 60, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em"}}>{value.toLocaleString("en-US")}</div>
    <div style={{marginTop: 6, fontSize: 14, color: ui.muted}}>Spend in Store and VAR</div>
  </div>
);

export const RefereeCard: React.FC<{width?: number; scanY: number; lit?: number}> = ({width = 560, scanY, lit = 0}) => (
  <div style={{...base, width, boxSizing: "border-box", background: ui.surface, borderRadius: 18, border: `1px solid ${ui.border}`, padding: 24, position: "relative", overflow: "hidden"}}>
    <div style={{display: "flex", alignItems: "center", gap: 10}}>
      <Icon d={ICON.shield} size={20} color={ui.primary} />
      <div style={{fontSize: 18, fontWeight: 600}}>AI Referee Engine</div>
      <div style={{marginLeft: "auto", fontSize: 12, color: "#15803D", background: "#DCFCE7", padding: "4px 10px", borderRadius: 999, fontWeight: 600}}>Active</div>
    </div>
    <div style={{marginTop: 12, fontSize: 15, lineHeight: 1.5, color: "#4A4A4A"}}>Semantic review for selected evaluation and moderation tasks.</div>
    <div style={{position: "absolute", left: 0, right: 0, top: `${scanY * 100}%`, height: 3, background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(23,23,23,0.7), rgba(0,0,0,0))", opacity: scanY > 0 && scanY < 1 ? 1 : 0}} />
    <div style={{position: "absolute", inset: 0, background: `rgba(245,197,66,${lit * 0.12})`, pointerEvents: "none"}} />
  </div>
);
