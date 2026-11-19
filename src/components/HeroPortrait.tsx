import type { Hero } from "../types/game";

/**
 * Bust portrait in period Turkic dress: a long-sleeved kaftan with a crossed collar and a trimmed edge,
 * a börk (felt cap) or a turban for the men and a headscarf covering hair and neck for the women.
 * Portraits are stylised; they do not claim to show the historical person's face.
 */
const TURBAN = new Set(["fatih", "melikshah", "tugrul", "alparslan", "mahmudghazni", "salahaddin", "nuraddin", "barbaros", "baybars", "aibak", "dedekorkut"]);

export function HeroPortrait({ hero, size = 56 }: { hero: Hero; size?: number }) {
  const [kaftan, trim] = hero.colors;
  const skin = "#c8956b";
  const female = hero.gender === "f";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={hero.name}>
      <rect width="64" height="64" rx="10" fill="#292524" />
      {/* kaftan: shoulders, crossed collar, trim */}
      <path d="M8 64 Q10 44 32 42 Q54 44 56 64 Z" fill={kaftan} />
      <path d="M32 42 L24 64 M32 42 L40 64" stroke={trim} strokeWidth="2.4" />
      <path d="M20 45 Q32 52 44 45" stroke={trim} strokeWidth="1.6" fill="none" />
      {female ? (
        <>
          {/* headscarf framing the face and covering neck and shoulders */}
          <path d="M16 36 Q14 12 32 10 Q50 12 48 36 Q46 46 32 47 Q18 46 16 36 Z" fill={trim} />
          <ellipse cx="32" cy="29" rx="9.5" ry="11" fill={skin} />
          <path d="M22.5 25 Q32 15 41.5 25" stroke={kaftan} strokeWidth="3" fill="none" />
          <circle cx="28.5" cy="29" r="1.1" fill="#1c1917" />
          <circle cx="35.5" cy="29" r="1.1" fill="#1c1917" />
          <path d="M29 35 Q32 37 35 35" stroke="#7c2d12" strokeWidth="1.1" fill="none" />
        </>
      ) : (
        <>
          <rect x="28" y="36" width="8" height="7" fill={skin} />
          <ellipse cx="32" cy="29" rx="10" ry="11.5" fill={skin} />
          {/* beard and moustache */}
          <path d="M22.5 31 Q24 43 32 44 Q40 43 41.5 31 Q38 37 32 37 Q26 37 22.5 31 Z" fill="#3f2a1e" />
          <path d="M27 34 Q32 32 37 34" stroke="#3f2a1e" strokeWidth="2" fill="none" />
          <circle cx="28" cy="28" r="1.2" fill="#1c1917" />
          <circle cx="36" cy="28" r="1.2" fill="#1c1917" />
          <path d="M25.5 25 L30 24.5 M34 24.5 L38.5 25" stroke="#3f2a1e" strokeWidth="1.3" />
          {TURBAN.has(hero.id) ? (
            <>
              <ellipse cx="32" cy="17" rx="13" ry="7.5" fill="#f5f5f4" />
              <path d="M20 18 Q32 10 44 18 M21 15 Q32 8 43 15" stroke="#d6d3d1" strokeWidth="1.2" fill="none" />
              <path d="M32 10 Q30 4 32 2 Q34 4 32 10" fill={trim} />
            </>
          ) : (
            <>
              {/* börk: tall felt cap with a fur band */}
              <path d="M21 20 Q20 4 32 3 Q44 4 43 20 Z" fill={trim} />
              <rect x="20" y="17" width="24" height="5" rx="2.5" fill="#57534e" />
            </>
          )}
        </>
      )}
    </svg>
  );
}
