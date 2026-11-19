import type { Hero } from "../types/game";

/**
 * Bust portrait in full, modest period dress: a long-sleeved kaftan buttoned to the neck with a crossed collar,
 * an outer robe over it, and covered heads for everyone. Men wear a börk, an akıncı börk with a plume, a turban,
 * a sultan's kavuk, a scholar's white turban or, in the 19th century, a fez; women wear a headscarf that covers
 * hair, neck and shoulders, with a hatun's gold band. Portraits are stylised and do not claim to show a face.
 */
export function HeroPortrait({ hero, size = 56 }: { hero: Hero; size?: number }) {
  const [kaftan, trim] = hero.colors;
  const skin = "#c8956b";
  const look = hero.look;
  const beardColor = hero.beard === "white" || look === "scholar" ? "#e7e5e4" : "#3f2a1e";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={hero.name}>
      <rect width="64" height="64" rx="10" fill="#292524" />
      {/* outer robe, kaftan buttoned to the neck, trim */}
      <path d="M6 64 Q8 44 32 41 Q56 44 58 64 Z" fill="#1c1917" opacity="0.55" />
      <path d="M10 64 Q12 45 32 42 Q52 45 54 64 Z" fill={kaftan} />
      <path d="M32 42 L25 64 M32 42 L39 64" stroke={trim} strokeWidth="2.2" />
      <path d="M21 45 Q32 51 43 45" stroke={trim} strokeWidth="1.6" fill="none" />
      {[48, 53, 58].map((y) => (
        <circle key={y} cx="32" cy={y} r="1" fill={trim} />
      ))}
      {look === "hatun" ? (
        <>
          {/* headscarf over hair, neck and shoulders */}
          <path d="M15 40 Q12 11 32 9 Q52 11 49 40 Q46 48 32 49 Q18 48 15 40 Z" fill={trim} />
          <path d="M14 44 Q32 54 50 44 L52 52 Q32 60 12 52 Z" fill={trim} opacity="0.85" />
          <ellipse cx="32" cy="29" rx="9.5" ry="11" fill={skin} />
          <path d="M22.5 24 Q32 15 41.5 24" stroke={kaftan} strokeWidth="3" fill="none" />
          <path d="M20 16 Q32 9 44 16" stroke="#e3a800" strokeWidth="1.6" fill="none" />
          <circle cx="28.5" cy="29" r="1.1" fill="#1c1917" />
          <circle cx="35.5" cy="29" r="1.1" fill="#1c1917" />
          <path d="M29 35 Q32 37 35 35" stroke="#7c2d12" strokeWidth="1.1" fill="none" />
        </>
      ) : (
        <>
          <rect x="28" y="36" width="8" height="7" fill={skin} />
          <ellipse cx="32" cy="29" rx="10" ry="11.5" fill={skin} />
          {hero.beard === "moustache" ? (
            <path d="M24 34 Q28 31 32 33 Q36 31 40 34 Q36 33.5 32 35 Q28 33.5 24 34 Z" fill={beardColor} />
          ) : (
            <>
              <path d="M22.5 31 Q24 43 32 44 Q40 43 41.5 31 Q38 37 32 37 Q26 37 22.5 31 Z" fill={beardColor} />
              <path d="M27 34 Q32 32 37 34" stroke={beardColor} strokeWidth="2" fill="none" />
            </>
          )}
          <circle cx="28" cy="28" r="1.2" fill="#1c1917" />
          <circle cx="36" cy="28" r="1.2" fill="#1c1917" />
          <path d="M25.5 25 L30 24.5 M34 24.5 L38.5 25" stroke={beardColor} strokeWidth="1.3" />
          {look === "bork" && (
            <>
              <path d="M21 20 Q20 4 32 3 Q44 4 43 20 Z" fill={trim} />
              <rect x="20" y="17" width="24" height="5" rx="2.5" fill="#57534e" />
            </>
          )}
          {look === "akinci" && (
            <>
              <path d="M21 20 Q21 6 32 5 Q43 6 43 20 Z" fill={kaftan} />
              <rect x="20" y="17" width="24" height="5" rx="2.5" fill="#78350f" />
              <path d="M40 9 Q50 1 48 -2 Q44 4 38 8 Z" fill="#f5f5f4" />
              <circle cx="40" cy="10" r="1.6" fill="#e3a800" />
            </>
          )}
          {(look === "turban" || look === "scholar") && (
            <>
              <ellipse cx="32" cy="17" rx="13" ry="7.5" fill={look === "scholar" ? "#f5f5f4" : "#e7e5e4"} />
              <path d="M20 18 Q32 10 44 18 M21 15 Q32 8 43 15" stroke="#d6d3d1" strokeWidth="1.2" fill="none" />
              <path d="M32 10 Q30 4 32 2 Q34 4 32 10" fill={look === "scholar" ? "#166534" : trim} />
            </>
          )}
          {look === "sultan" && (
            <>
              {/* tall kavuk wrapped in a white turban, jewelled aigrette */}
              <path d="M22 18 Q21 1 32 0 Q43 1 42 18 Z" fill="#f5f5f4" />
              <path d="M22.5 14 Q32 9 41.5 14 M23 9 Q32 4 41 9" stroke="#d6d3d1" strokeWidth="1.2" fill="none" />
              <rect x="20" y="16" width="24" height="5" rx="2.5" fill="#e7e5e4" />
              <circle cx="32" cy="12" r="2" fill="#c8102e" stroke="#e3a800" strokeWidth="0.8" />
              <path d="M32 10 Q29 2 33 -2 Q33 4 32 10" fill="#e3a800" />
            </>
          )}
          {look === "fez" && (
            <>
              <path d="M23 19 L24.5 8 Q32 6 39.5 8 L41 19 Z" fill="#b91c1c" />
              <path d="M32 7 Q36 10 38 16" stroke="#1c1917" strokeWidth="1.2" fill="none" />
            </>
          )}
        </>
      )}
    </svg>
  );
}
