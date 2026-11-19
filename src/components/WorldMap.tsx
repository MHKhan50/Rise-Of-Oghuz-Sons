import { crescentPath, starPath } from "./EraSancak";
import { tamgaPath } from "./TamgaFlag";

/** Equirectangular projection from Italy and the Balkans to Hindustan (stylised coastlines). */
const LON0 = 12;
const LAT0 = 49.5;
const K = 12;
export const MAP_W = (82 - LON0) * K;
export const MAP_H = (LAT0 - 15) * K;
const xy = ([lon, lat]: [number, number]): [number, number] => [(lon - LON0) * K, (LAT0 - lat) * K];
const poly = (pts: [number, number][]) => pts.map((p) => xy(p).join(",")).join(" ");

const SEAS: [number, number][][] = [
  // Mediterranean, Ionian and Aegean
  [[12, 37.9], [15.6, 38.2], [16.1, 38.9], [17.1, 39.0], [18.5, 40.1], [19.4, 40.4], [20.1, 39.6], [21.1, 38.4], [21.6, 37.0], [22.5, 36.4],
    [23.2, 36.4], [23.1, 37.9], [24.0, 38.3], [22.9, 40.5], [24.0, 40.7], [26.0, 40.8], [26.6, 40.3], [26.2, 39.5], [27.1, 38.4], [27.3, 37.0],
    [28.2, 36.7], [30.5, 36.4], [32.5, 36.1], [34.5, 36.8], [36.0, 36.8], [35.9, 35.5], [35.6, 34.5], [35.0, 33.0], [34.5, 31.5], [32.3, 31.2],
    [30.0, 31.4], [29.0, 30.9], [25.0, 31.7], [20.0, 32.0], [19.5, 30.5], [15.5, 31.3], [13.0, 32.9], [12, 33.5]],
  // Adriatic
  [[18.5, 40.1], [17.1, 40.5], [16.0, 41.4], [14.5, 42.3], [13.6, 43.6], [12.3, 44.5], [12.4, 45.4], [13.7, 45.7], [14.6, 45.1], [15.9, 43.6], [17.4, 43.0], [19.0, 42.0], [19.4, 40.6]],
  // Sea of Marmara
  [[26.7, 40.4], [27.5, 40.95], [29.0, 41.0], [29.9, 40.75], [29.0, 40.4], [27.6, 40.3]],
  // Black Sea
  [[28, 41.2], [28.5, 43], [29.7, 45.2], [30.5, 46.3], [33.5, 45.8], [36.5, 45.2], [39.5, 44], [41.5, 42], [40, 41], [36, 41.6], [33, 42], [30, 41.2], [29.1, 41.2]],
  // Sea of Azov
  [[35.0, 45.4], [36.8, 45.4], [38.2, 46.8], [39.3, 47.1], [37.0, 46.5], [35.3, 46.2]],
  // Caspian Sea
  [[47, 45], [50, 46.6], [53, 45.5], [52.5, 43], [53, 40], [54, 37.3], [51, 36.7], [49, 37.6], [49.5, 40.5], [47.5, 42.5]],
  // Persian Gulf
  [[48, 30], [50.3, 29.8], [51.5, 27.8], [54, 26.6], [56.3, 26.2], [56.5, 24.5], [54, 24.2], [51.5, 25.6], [50, 26.6], [48.3, 28.5]],
  // Red Sea (northern part)
  [[32.5, 29.9], [33.5, 28.0], [35.0, 26.0], [37.5, 21.5], [39.2, 21.0], [37.0, 24.5], [35.0, 28.0], [34.9, 29.5], [33.6, 27.8]],
  // Arabian Sea
  [[57, 15], [57, 22.5], [59.8, 22.6], [61.5, 25.2], [66.5, 25.4], [68.5, 23.5], [70, 21], [72.8, 19], [74, 15]],
  // Aral Sea
  [[58.3, 44.5], [59.5, 46.2], [61.5, 46.5], [61.6, 44.5], [60, 43.5]],
];

const ISLANDS: [number, number][][] = [
  [[12.4, 38.1], [15.6, 38.3], [15.1, 36.7], [12.5, 37.6]], // Sicily
  [[23.5, 35.5], [24.5, 35.4], [26.3, 35.1], [25.5, 35.0], [23.6, 35.25]], // Crete
  [[32.3, 35.0], [33.0, 35.4], [34.6, 35.7], [34.0, 35.0], [33.0, 34.6]], // Cyprus
  [[27.7, 36.1], [28.2, 36.45], [28.25, 36.0]], // Rhodes
  [[22.8, 38.9], [24.6, 38.1], [23.4, 38.4]], // Euboea
];

const LABELS: [string, [number, number]][] = [
  ["RUMELIA", [24.5, 42.4]], ["HUNGARY", [20.5, 47.2]], ["ANATOLIA", [32.5, 39.4]], ["IRAN", [53.5, 33.5]], ["KHORASAN", [61, 36.5]],
  ["TRANSOXIANA", [65, 41.8]], ["HINDUSTAN", [76.5, 22.5]], ["SYRIA", [38.2, 34.4]], ["EGYPT", [29.5, 27.5]], ["CAUCASUS", [44.5, 42.6]],
  ["DESHT-I KIPCHAK", [42, 47.8]], ["ITALY", [15.2, 41.4]],
];

export interface MapPoint {
  id: string;
  name: string;
  lonLat: [number, number];
  /** Banner colours and, for one of the 24 tribes, its tamga. */
  colors: [string, string];
  tamgaOf?: string;
  /** Crescent, or crescent and star, on a red flag (late Ottoman eras). */
  emblem?: "crescent" | "crescentStar";
  own: boolean;
  locked?: boolean;
  battle?: boolean;
}

function MiniBanner({ x, y, p }: { x: number; y: number; p: MapPoint }) {
  const [field, mark] = p.colors;
  return (
    <g transform={`translate(${x} ${y})`} opacity={p.locked ? 0.35 : 1}>
      <line x1="0" y1="2" x2="0" y2="-22" stroke="#78350f" strokeWidth="1.6" />
      <path d="M0 -26 L2 -22 L0 -21 L-2 -22 Z" fill="#e3a800" />
      <path d="M0.5 -21 L16 -21 L12.5 -16 L16 -11 L0.5 -11 Z" fill={field} stroke={p.own ? "#5fa65a" : mark} strokeWidth={p.own ? 1.6 : 0.8} />
      {p.emblem ? (
        <>
          <path d={crescentPath(6.5, -16, 3.4)} fill="#f5f5f4" />
          {p.emblem === "crescentStar" && <path d={starPath(10.6, -16, 1.6)} fill="#f5f5f4" />}
        </>
      ) : p.tamgaOf ? (
        <g transform="translate(8 -16) scale(0.28)">
          <path d={tamgaPath(p.tamgaOf)} stroke={mark} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <rect x="5" y="-18" width="5" height="4" fill={mark} />
      )}
    </g>
  );
}

/** Visible window that frames the given points, keeping the map's aspect ratio. */
function frame(points: MapPoint[], fit: boolean): [number, number, number, number] {
  if (!fit || points.length === 0) return [0, 0, MAP_W, MAP_H];
  const ps = points.map((p) => xy(p.lonLat));
  let x0 = Math.min(...ps.map((p) => p[0])) - 40;
  let x1 = Math.max(...ps.map((p) => p[0])) + 60;
  let y0 = Math.min(...ps.map((p) => p[1])) - 50;
  let y1 = Math.max(...ps.map((p) => p[1])) + 40;
  const ratio = MAP_W / MAP_H;
  let w = Math.max(x1 - x0, 280);
  let h = y1 - y0;
  if (w / h < ratio) w = h * ratio;
  else h = w / ratio;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  w = Math.min(w, MAP_W);
  h = Math.min(h, MAP_H);
  x0 = Math.min(Math.max(0, cx - w / 2), MAP_W - w);
  y0 = Math.min(Math.max(0, cy - h / 2), MAP_H - h);
  return [x0, y0, w, h];
}

export function WorldMap({ points, selected, onSelect, label, fit = false }: { points: MapPoint[]; selected: string; onSelect: (id: string) => void; label: string; fit?: boolean }) {
  const sel = points.find((s) => s.id === selected);
  const [vx, vy, vw, vh] = frame(points, fit);
  const z = vw / MAP_W;
  return (
    <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} className="w-full rounded-lg border border-stone-700" role="img" aria-label={label}>
      <defs>
        <radialGradient id="parchment" cx="0.5" cy="0.45" r="0.8">
          <stop offset="0" stopColor="#3b3125" />
          <stop offset="1" stopColor="#1c1917" />
        </radialGradient>
      </defs>
      <rect width={MAP_W} height={MAP_H} fill="url(#parchment)" />
      {SEAS.map((s, i) => (
        <polygon key={i} points={poly(s)} fill="#1f4e9c" opacity={0.55} stroke="#38bdf8" strokeOpacity={0.3} />
      ))}
      {ISLANDS.map((s, i) => (
        <polygon key={i} points={poly(s)} fill="#3b3125" />
      ))}
      {LABELS.map(([name, p]) => {
        const [x, y] = xy(p);
        return (
          <text key={name} x={x} y={y} fill="#a8a29e" fontSize={12 * Math.max(z, 0.5)} letterSpacing={3 * z} textAnchor="middle" opacity={0.5}>
            {name}
          </text>
        );
      })}
      {points.map((p) => {
        const [x, y] = xy(p.lonLat);
        return (
          <g key={p.id} onClick={() => onSelect(p.id)} style={{ cursor: "pointer" }} transform={`translate(${x} ${y}) scale(${Math.max(z, 0.45)}) translate(${-x} ${-y})`}>
            <title>{p.name}</title>
            <circle cx={x} cy={y} r={12} fill="transparent" />
            <MiniBanner x={x} y={y} p={p} />
            {p.battle ? (
              <path d={`M${x - 4} ${y - 2} L${x + 4} ${y + 6} M${x + 4} ${y - 2} L${x - 4} ${y + 6}`} stroke={p.own ? "#5fa65a" : "#d6d3d1"} strokeWidth="1.8" opacity={p.locked ? 0.4 : 1} />
            ) : (
              <rect x={x - 4} y={y - 1} width={8} height={6} fill={p.own ? "#5fa65a" : "#a8a29e"} stroke="#1c1917" strokeWidth="0.8" opacity={p.locked ? 0.4 : 1} />
            )}
            {p.id === selected && <circle cx={x} cy={y + 2} r={9} fill="none" stroke="#e3a800" strokeWidth="2" />}
          </g>
        );
      })}
      {sel && (() => {
        const [x, y] = xy(sel.lonLat);
        const left = x > vx + vw * 0.7;
        return (
          <text x={left ? x - 10 * z : x + 10 * z} y={y + 16 * Math.max(z, 0.45)} fill="#e3a800" fontSize={13 * Math.max(z, 0.5)} fontWeight="bold" textAnchor={left ? "end" : "start"} stroke="#1c1917" strokeWidth={3 * z} paintOrder="stroke">
            {sel.name}
          </text>
        );
      })()}
    </svg>
  );
}
