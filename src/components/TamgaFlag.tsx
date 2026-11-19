import type { Tribe } from "../types/game";

/**
 * A tribe's standard in the manner of the steppe tuğ: a spear-headed pole with a horse-tail plume and a
 * swallow-tailed silk banner carrying the tribe's mark. The Kayı mark follows its well-known two-stroke form;
 * the other marks are generated from the tribe id so that each banner is distinct. They are game emblems, not
 * reproductions of the historical damgas recorded by Kashgari and Rashid al-Din.
 */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function tamgaPath(id: string): string {
  if (id === "kayi") return "M-9 -12 L-9 12 M9 -12 L9 12 M-9 -1 Q0 -14 9 -1 M0 -7 L0 12";
  const h = hash(id);
  const parts: string[] = [];
  const stems = 1 + (h % 3);
  for (let i = 0; i < stems; i++) {
    const x = (i - (stems - 1) / 2) * 8;
    parts.push(`M${x} -12 L${x} 12`);
  }
  switch ((h >> 3) % 5) {
    case 0: parts.push("M-11 -4 Q0 -16 11 -4"); break;
    case 1: parts.push("M-11 5 Q0 17 11 5"); break;
    case 2: parts.push("M-11 -11 L0 0 L11 -11"); break;
    case 3: parts.push("M-10 0 L10 0"); break;
    default: parts.push("M-8 9 A8 8 0 0 1 8 9"); break;
  }
  if ((h >> 7) % 2) parts.push("M-5 -12 L0 -16 L5 -12");
  if ((h >> 9) % 3 === 0) parts.push("M-12 3 L-7 7 M12 3 L7 7");
  return parts.join(" ");
}

export function TamgaFlag({ tribe, size = 72, conquered = false }: { tribe: Tribe; size?: number; conquered?: boolean }) {
  const [field, mark] = tribe.colors;
  const id = `g-${tribe.id}`;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 78" role="img" aria-label={`${tribe.name} tuğ`}>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor={field} />
          <stop offset="1" stopColor={field} stopOpacity={0.82} />
        </linearGradient>
      </defs>
      {/* pole and spearhead finial */}
      <line x1="10" y1="10" x2="10" y2="77" stroke="#78350f" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M10 1 L13 9 L10 12 L7 9 Z" fill="#e3a800" stroke="#92400e" strokeWidth="0.6" />
      <circle cx="10" cy="13" r="2.2" fill="#e3a800" />
      {/* horse-tail plume */}
      <path d="M8 15 Q4 24 6 34 M10 15 Q9 25 10 35 M12 15 Q15 24 13 33" stroke="#3f2a1e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* swallow-tailed banner */}
      <path d="M11 16 L57 16 L48 31 L57 46 L11 46 Z" fill={`url(#${id})`} stroke={mark} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11 16 L57 16 L55 19 L11 19 Z" fill={mark} opacity={0.9} />
      <g transform="translate(30 32)">
        <path d={tamgaPath(tribe.id)} fill="none" stroke={mark} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {conquered && <circle cx="52" cy="54" r="5" fill="#5fa65a" stroke="white" strokeWidth="1.4" />}
    </svg>
  );
}
