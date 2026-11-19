import type { EraBanner } from "../data/eras";
import type { Tribe } from "../types/game";
import { tamgaPath } from "./TamgaFlag";

/** Crescent opening to the fly, as on the 1793 and 1844 flags. */
export function crescentPath(cx: number, cy: number, r: number): string {
  const r2 = r * 0.8;
  return `M${cx + r * 0.35} ${cy - r * 0.94} A${r} ${r} 0 1 0 ${cx + r * 0.35} ${cy + r * 0.94} A${r2} ${r2} 0 1 1 ${cx + r * 0.35} ${cy - r * 0.94} Z`;
}

export function starPath(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.4;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

/** The banner of an era: a tuğ with the tribe's emblem, a red sancak, or the red flag with crescent (and star). */
export function EraSancak({ banner, tribe, size = 64 }: { banner: EraBanner | null; tribe: Tribe; size?: number }) {
  const kind = banner?.kind ?? "tug";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={kind} className="shrink-0">
      <line x1="10" y1="62" x2="10" y2="6" stroke="#78350f" strokeWidth="2.4" />
      <path d="M10 1 L13 6 L10 7.5 L7 6 Z" fill="#e3a800" />
      {kind === "tug" ? (
        <>
          {/* horse-tail plume and the tribe's banner */}
          <path d="M10 8 Q4 16 6 26 Q9 18 10 26 Q11 18 14 26 Q16 16 10 8 Z" fill="#d6d3d1" />
          <path d="M11 28 L56 28 L48 38 L56 48 L11 48 Z" fill={tribe.colors[0]} stroke={tribe.colors[1]} strokeWidth="1.2" />
          <g transform="translate(30 38) scale(0.55)">
            <path d={tamgaPath(tribe.id)} stroke={tribe.colors[1]} strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        </>
      ) : (
        <>
          <path d="M11 9 L58 9 L58 45 L11 45 Z" fill="#c8102e" />
          {kind !== "red" && <path d={crescentPath(30, 27, 10)} fill="#f5f5f4" />}
          {kind === "redCrescentStar" && <path d={starPath(41, 27, 4.2)} fill="#f5f5f4" />}
        </>
      )}
    </svg>
  );
}
