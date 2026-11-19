import { STATES, TRIBE_BY_ID } from "../data/oghuzData";
import type { HistoricalState, Tribe } from "../types/game";
import { tamgaPath } from "./TamgaFlag";

/** Equirectangular projection of the region from the Balkans to Hindustan (stylised coastlines). */
const LON0 = 24;
const LAT0 = 48;
const K = 12;
const W = (82 - LON0) * K;
const H = (LAT0 - 15) * K;
const xy = ([lon, lat]: [number, number]): [number, number] => [(lon - LON0) * K, (LAT0 - lat) * K];
const poly = (pts: [number, number][]) => pts.map((p) => xy(p).join(",")).join(" ");

const SEAS: [number, number][][] = [
  // Black Sea
  [[28, 41.2], [29, 43], [30.5, 45.5], [33.5, 45.8], [36.5, 45.2], [39.5, 44], [41.5, 42], [40, 41], [36, 41.6], [33, 42], [30, 41.2]],
  // Caspian Sea
  [[47, 45], [50, 46.6], [53, 45.5], [52.5, 43], [53, 40], [54, 37.3], [51, 36.7], [49, 37.6], [49.5, 40.5], [47.5, 42.5]],
  // Eastern Mediterranean
  [[24, 34], [24, 38.5], [26, 40], [27, 37.5], [30, 36.4], [33, 36.2], [36, 36.6], [35.6, 34.5], [34.5, 31.5], [32, 31.2], [29, 30.9], [25, 31.6]],
  // Persian Gulf
  [[48, 30], [50.3, 29.8], [51.5, 27.8], [54, 26.6], [56.3, 26.2], [56.5, 24.5], [54, 24.2], [51.5, 25.6], [50, 26.6], [48.3, 28.5]],
  // Arabian Sea
  [[57, 15], [57, 22.5], [59.8, 22.6], [61.5, 25.2], [66.5, 25.4], [68.5, 23.5], [70, 21], [72.8, 19], [74, 15]],
  // Aral Sea
  [[58.3, 44.5], [59.5, 46.2], [61.5, 46.5], [61.6, 44.5], [60, 43.5]],
];

const LABELS: [string, [number, number]][] = [
  ["ANATOLIA", [31, 39.4]], ["IRAN", [53.5, 33.5]], ["KHORASAN", [61, 36.5]], ["TRANSOXIANA", [65, 41.8]],
  ["HINDUSTAN", [76.5, 24]], ["SYRIA", [37.6, 34.2]], ["EGYPT", [28.5, 27.5]], ["CAUCASUS", [44.5, 41.8]],
];

function MiniBanner({ x, y, tribe, own }: { x: number; y: number; tribe?: Tribe; own: boolean }) {
  const [field, mark] = tribe ? tribe.colors : ["#57534e", "#a8a29e"];
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1="0" y1="2" x2="0" y2="-22" stroke="#78350f" strokeWidth="1.6" />
      <path d="M0 -26 L2 -22 L0 -21 L-2 -22 Z" fill="#e3a800" />
      <path d="M0.5 -21 L16 -21 L12.5 -16 L16 -11 L0.5 -11 Z" fill={field} stroke={own ? "#5fa65a" : mark} strokeWidth={own ? 1.6 : 0.8} />
      {tribe && (
        <g transform="translate(8 -16) scale(0.28)">
          <path d={tamgaPath(tribe.id)} stroke={mark} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

export function WorldMap({
  conquered,
  selected,
  onSelect,
  player,
}: {
  conquered: string[];
  selected: string;
  onSelect: (id: string) => void;
  player: Tribe;
}) {
  const sel = STATES.find((s) => s.id === selected);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg border border-stone-700" role="img" aria-label="Map of the states">
      <defs>
        <radialGradient id="parchment" cx="0.5" cy="0.45" r="0.8">
          <stop offset="0" stopColor="#3b3125" />
          <stop offset="1" stopColor="#1c1917" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#parchment)" />
      {SEAS.map((s, i) => (
        <polygon key={i} points={poly(s)} fill="#1f4e9c" opacity={0.55} stroke="#38bdf8" strokeOpacity={0.3} />
      ))}
      {LABELS.map(([name, p]) => {
        const [x, y] = xy(p);
        return (
          <text key={name} x={x} y={y} fill="#a8a29e" fontSize="13" letterSpacing="3" textAnchor="middle" opacity={0.6}>
            {name}
          </text>
        );
      })}
      {STATES.map((s: HistoricalState) => {
        const [x, y] = xy(s.lonLat);
        const won = conquered.includes(s.id);
        const tribe = won ? player : s.tribeLink ? TRIBE_BY_ID[s.tribeLink] : undefined;
        return (
          <g key={s.id} onClick={() => onSelect(s.id)} style={{ cursor: "pointer" }}>
            <circle cx={x} cy={y} r={14} fill="transparent" />
            <MiniBanner x={x} y={y} tribe={tribe} own={won} />
            <rect x={x - 4} y={y - 1} width={8} height={6} fill={won ? "#5fa65a" : "#a8a29e"} stroke="#1c1917" strokeWidth="0.8" />
            {s.id === selected && <circle cx={x} cy={y + 2} r={9} fill="none" stroke="#e3a800" strokeWidth="2" />}
          </g>
        );
      })}
      {sel && (() => {
        const [x, y] = xy(sel.lonLat);
        const left = x > W - 160;
        return (
          <text x={left ? x - 10 : x + 10} y={y + 16} fill="#e3a800" fontSize="13" fontWeight="bold" textAnchor={left ? "end" : "start"} stroke="#1c1917" strokeWidth="3" paintOrder="stroke">
            {sel.name}
          </text>
        );
      })()}
    </svg>
  );
}
