import { Play, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, Card, CostLine, SectionTitle } from "../components/ui";
import { HERO_BY_ID, TOWERS } from "../data/oghuzData";
import { heroBonus } from "../engine/combat";
import { canAfford, totalBuffs } from "../engine/economy";
import { useI18n } from "../i18n";
import { towerCost, type Action } from "../state/useGame";
import type { GameState, TowerType } from "../types/game";

const W = 360;
const H = 240;
const PATH: [number, number][] = [
  [0, 40], [120, 40], [120, 130], [240, 130], [240, 60], [330, 60], [330, 200], [360, 200],
];
const SLOTS: [number, number][] = [[70, 80], [165, 90], [180, 170], [285, 95], [200, 30], [290, 160]];

interface Enemy { d: number; hp: number; max: number; speed: number; alive: boolean }
interface Shot { x1: number; y1: number; x2: number; y2: number; t: number; color: string }

const SEGMENTS = PATH.slice(1).map((p, i) => {
  const [x0, y0] = PATH[i];
  return { x0, y0, x1: p[0], y1: p[1], len: Math.hypot(p[0] - x0, p[1] - y0) };
});
const PATH_LEN = SEGMENTS.reduce((s, g) => s + g.len, 0);

function pointAt(d: number): [number, number] {
  let rest = d;
  for (const g of SEGMENTS) {
    if (rest <= g.len) {
      const f = rest / g.len;
      return [g.x0 + (g.x1 - g.x0) * f, g.y0 + (g.y1 - g.y0) * f];
    }
    rest -= g.len;
  }
  return PATH[PATH.length - 1];
}

export function waveSpec(wave: number) {
  return { count: 6 + 2 * wave, hp: Math.round(28 * Math.pow(1.2, wave - 1)), speed: 28 + 2 * Math.min(wave, 20) };
}

export function DefenseTab({ state, act }: { state: GameState; act: (a: Action) => void }) {
  const { t, tx } = useI18n();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const wave = waveSpec(state.defenseWave);
  const b = totalBuffs(state);
  const hb = heroBonus(state);
  const heroPct = state.squad.reduce((s, id) => s + (HERO_BY_ID[id] ? 0.5 * (HERO_BY_ID[id].power + 2 * ((state.heroes[id]?.level ?? 1) - 1)) : 0), 0);
  const dmgMult = 1 + (b.towerPct + hb.defense + hb.tower + heroPct) / 100;
  const wallMax = Math.round(10 * (1 + b.defensePct / 100));

  // Draw the idle field when not running.
  useEffect(() => {
    if (running) return;
    const ctx = canvas.current?.getContext("2d");
    if (ctx) drawField(ctx, state.towers, state.towerLevels, [], [], wallMax, wallMax);
  }, [running, state.towers, state.towerLevels, wallMax]);

  function start() {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || running) return;
    setRunning(true);
    setStatus("");
    const enemies: Enemy[] = [];
    const shots: Shot[] = [];
    const cooldowns = state.towers.map(() => 0);
    let spawned = 0;
    let spawnTimer = 0;
    let wall = wallMax;
    let leaked = 0;
    let last = performance.now();
    const towers = [...state.towers];
    const levels = [...state.towerLevels];

    const frame = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000);
      last = time;
      spawnTimer -= dt;
      if (spawned < wave.count && spawnTimer <= 0) {
        enemies.push({ d: 0, hp: wave.hp, max: wave.hp, speed: wave.speed * (0.9 + Math.random() * 0.2), alive: true });
        spawned += 1;
        spawnTimer = 0.9;
      }
      for (const e of enemies) {
        if (!e.alive) continue;
        e.d += e.speed * dt;
        if (e.d >= PATH_LEN) {
          e.alive = false;
          wall -= 1;
          leaked += 1;
        }
      }
      towers.forEach((tw, i) => {
        if (!tw) return;
        cooldowns[i] -= dt;
        if (cooldowns[i] > 0) return;
        const info = TOWERS[tw];
        const [sx, sy] = SLOTS[i];
        let best: Enemy | null = null;
        for (const e of enemies) {
          if (!e.alive) continue;
          const [ex, ey] = pointAt(e.d);
          if (Math.hypot(ex - sx, ey - sy) <= info.range && (!best || e.d > best.d)) best = e;
        }
        if (!best) return;
        const dmg = info.damage * (1 + 0.35 * (levels[i] - 1)) * dmgMult;
        const [bx, by] = pointAt(best.d);
        if (info.splash > 0) {
          for (const e of enemies) {
            if (!e.alive) continue;
            const [ex, ey] = pointAt(e.d);
            if (Math.hypot(ex - bx, ey - by) <= info.splash) e.hp -= dmg;
          }
        } else {
          best.hp -= dmg;
        }
        for (const e of enemies) if (e.alive && e.hp <= 0) e.alive = false;
        shots.push({ x1: sx, y1: sy, x2: bx, y2: by, t: 0.12, color: info.color });
        cooldowns[i] = info.cooldown;
      });
      for (const s of shots) s.t -= dt;
      while (shots.length && shots[0].t <= 0) shots.shift();
      drawField(ctx, towers, levels, enemies.filter((e) => e.alive), shots, wall, wallMax);

      const finished = spawned >= wave.count && enemies.every((e) => !e.alive);
      if (wall <= 0 || finished) {
        const won = wall > 0;
        setRunning(false);
        setStatus(won ? t("waveHeld", { n: state.defenseWave, l: leaked }) : t("wallsFell", { n: state.defenseWave }));
        act({ type: "defenseDone", won, leaked, now: Date.now() });
        return;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[3fr_2fr]">
      <Card>
        <SectionTitle title={t("siegeTitle", { n: state.defenseWave })} sub={t("siegeSub", { c: wave.count, hp: wave.hp, m: dmgMult.toFixed(2) })} />
        <canvas ref={canvas} width={W} height={H} className="w-full rounded-lg border border-stone-700 bg-stone-950" style={{ imageRendering: "pixelated", aspectRatio: `${W} / ${H}` }} />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-stone-300">{status || t("wallsLine", { w: wallMax, t: state.towers.filter(Boolean).length })}</span>
          <Button tone="red" onClick={start} disabled={running || !state.towers.some(Boolean)}>
            <span className="flex items-center gap-1">
              <Play size={14} /> {running ? t("defending") : t("startWave")}
            </span>
          </Button>
        </div>
      </Card>
      <Card>
        <SectionTitle title={t("towersTitle")} sub={t("towersSub")} />
        {state.towers.map((tw, i) => (
          <div key={i} className="mb-2 rounded-lg border border-stone-700 bg-stone-950/60 p-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Shield size={14} className="text-stone-400" /> {t("slot", { n: i + 1 })}: {tw ? `${TOWERS[tw].name} · ${t("level")} ${state.towerLevels[i]}` : t("empty")}
              </span>
              {tw && state.towerLevels[i] < 10 && (
                <Button small disabled={running || !canAfford(state.resources, towerCost(tw, state.towerLevels[i] + 1))} onClick={() => act({ type: "upgradeTower", slot: i })}>
                  {t("upgrade")}
                </Button>
              )}
            </div>
            {tw ? (
              state.towerLevels[i] < 10 && <CostLine cost={towerCost(tw, state.towerLevels[i] + 1)} have={state.resources} />
            ) : (
              <div className="mt-1 flex flex-wrap gap-1">
                {(Object.keys(TOWERS) as TowerType[]).map((tw2) => (
                  <Button key={tw2} small tone="ghost" disabled={running || !canAfford(state.resources, towerCost(tw2, 1))} onClick={() => act({ type: "placeTower", slot: i, tower: tw2 })}>
                    {tx(TOWERS[tw2].label)}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="text-xs text-stone-400">
          {(Object.keys(TOWERS) as TowerType[]).map((tw2) => (
            <div key={tw2}>
              <b style={{ color: TOWERS[tw2].color }}>{tx(TOWERS[tw2].label)}</b>: {t("damage")} {TOWERS[tw2].damage}, {t("range")} {TOWERS[tw2].range}
              {TOWERS[tw2].splash ? `, ${t("splash")}` : ""} — <CostLine cost={towerCost(tw2, 1)} have={state.resources} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function drawField(
  ctx: CanvasRenderingContext2D,
  towers: (TowerType | null)[],
  levels: number[],
  enemies: Enemy[],
  shots: Shot[],
  wall: number,
  wallMax: number,
) {
  ctx.fillStyle = "#1c1917";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#78716c";
  ctx.lineWidth = 16;
  ctx.lineJoin = "round";
  ctx.beginPath();
  PATH.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  // Walls of the oba at the end of the road.
  ctx.fillStyle = "#1f4e9c";
  ctx.fillRect(W - 14, 180, 14, 40);
  ctx.fillStyle = "#c8102e";
  ctx.fillRect(4, 4, 80 * (wall / wallMax), 6);
  ctx.strokeStyle = "#e3a800";
  ctx.lineWidth = 1;
  ctx.strokeRect(4, 4, 80, 6);
  SLOTS.forEach(([x, y], i) => {
    const tw = towers[i];
    ctx.fillStyle = tw ? TOWERS[tw].color : "#44403c";
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0c0a09";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tw ? String(levels[i]) : String(i + 1), x, y + 3.5);
  });
  for (const e of enemies) {
    const [x, y] = pointAt(e.d);
    ctx.fillStyle = "#d6d3d1";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c8102e";
    ctx.fillRect(x - 6, y - 10, 12 * Math.max(0, e.hp / e.max), 2);
  }
  for (const s of shots) {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.stroke();
  }
}
