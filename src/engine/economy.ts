import { BUILDINGS, HERO_BY_ID, STATES, TRIBE_BY_ID, TROOPS } from "../data/oghuzData";
import { PATH_BY_ID, type Era, type Path } from "../data/eras";
import type { BuildingId, Buffs, GameState, ResourceId, Resources, TroopId } from "../types/game";

export const RESOURCE_IDS: ResourceId[] = ["azik", "kereste", "tas", "demir", "altin", "celik"];
export const TROOP_IDS: TroopId[] = ["azap", "okcu", "sipahi"];
export const SAVE_VERSION = 3;
export const MAX_OFFLINE_SECONDS = 8 * 3600;
export const TOY_DURATION_MS = 60 * 60 * 1000;
export const TOY_COOLDOWN_MS = 8 * 60 * 60 * 1000;

export function newGame(now: number): GameState {
  return {
    version: SAVE_VERSION,
    tribe: null,
    resources: { azik: 600, kereste: 600, tas: 400, demir: 150, altin: 250, celik: 0 },
    buildings: { otag: 1, cami: 0, medrese: 0, kervansaray: 0, ciftlik: 1, kerestehane: 1, tasocagi: 1, maden: 0, depo: 1, kisla: 1, ahir: 0, demirci: 0, sifahane: 0 },
    troops: { azap: 20, okcu: 10, sipahi: 0 },
    wounded: { azap: 0, okcu: 0, sipahi: 0 },
    herds: { koyun: 2, at: 0, deve: 0 },
    heroes: {},
    conquered: [],
    towers: [null, null, null, null, null, null],
    towerLevels: [1, 1, 1, 1, 1, 1],
    defenseWave: 1,
    huntCooldowns: {},
    log: [],
    squad: [],
    toyUntil: 0,
    lastToy: 0,
    path: null,
    era: 0,
    forts: [],
    huntsWon: 0,
    ocaks: {},
    founded: false,
    lastTick: now,
  };
}

/** All percentage bonuses: chosen tribe + tribute of conquered states. */
export function totalBuffs(state: GameState): Required<Buffs> {
  const out: Required<Buffs> = {
    azikPct: 0, kerestePct: 0, tasPct: 0, demirPct: 0, altinPct: 0, infantryPct: 0, archerPct: 0,
    cavalryPct: 0, defensePct: 0, buildCostPct: 0, trainCostPct: 0, healPct: 0, huntPct: 0, towerPct: 0,
  };
  const add = (b: Buffs) => {
    for (const [k, v] of Object.entries(b)) out[k as keyof Buffs] += v ?? 0;
  };
  if (state.tribe) add(TRIBE_BY_ID[state.tribe].buffs);
  for (const id of state.conquered) {
    const s = STATES.find((x) => x.id === id);
    if (s) add(s.tribute);
  }
  out.cavalryPct += OCAK_CAVALRY * ocakLevels(state);
  return out;
}

export function storageCap(state: GameState): number {
  return Math.round(2000 * Math.pow(1.55, state.buildings.depo - 1));
}

export function armyCap(state: GameState): number {
  return 60 + 50 * state.buildings.kisla + 40 * state.buildings.ahir + 20 * state.buildings.otag;
}

export function herdCap(state: GameState): number {
  return 4 + state.buildings.otag * 3;
}

export function armySize(state: GameState): number {
  return TROOP_IDS.reduce((n, t) => n + state.troops[t], 0);
}

/** Resources gained per second. */
export function productionPerSecond(state: GameState, now: number): Resources {
  const b = totalBuffs(state);
  const lv = state.buildings;
  const toy = now < state.toyUntil ? 1.1 : 1;
  const rate = (base: number, pct: number) => base * (1 + pct / 100) * toy;
  return {
    azik: rate(1.0 * lv.ciftlik + 0.25 * state.herds.koyun, b.azikPct),
    kereste: rate(0.9 * lv.kerestehane, b.kerestePct),
    tas: rate(0.7 * lv.tasocagi, b.tasPct),
    demir: rate(0.45 * lv.maden, b.demirPct),
    // Gold comes only from gaza, hunting and the defence of the frontier, never from passive income.
    altin: 0,
    celik: lv.demirci > 0 ? 0.03 * lv.demirci : 0,
  };
}

/** Advance the economy by `seconds`: production (capped by storage), steel forging and healing. */
export function tick(state: GameState, seconds: number, now: number): GameState {
  if (seconds <= 0) return state;
  const cap = storageCap(state);
  const prod = productionPerSecond(state, now);
  const resources = { ...state.resources };
  for (const r of RESOURCE_IDS) {
    if (r === "celik") continue;
    resources[r] = Math.min(cap, resources[r] + prod[r] * seconds);
  }
  // Forging steel consumes iron (2 iron per steel).
  const steel = Math.min(prod.celik * seconds, resources.demir / 2);
  resources.celik += steel;
  resources.demir -= steel * 2;

  const wounded = { ...state.wounded };
  const troops = { ...state.troops };
  const b = totalBuffs(state);
  const korkut = state.squad.includes("dedekorkut") ? 1.3 : 1;
  let heal = 0.15 * state.buildings.sifahane * (1 + b.healPct / 100) * korkut * seconds;
  for (const t of TROOP_IDS) {
    const h = Math.min(wounded[t], heal);
    wounded[t] -= h;
    troops[t] += h;
    heal -= h;
  }
  return { ...state, resources, troops, wounded, lastTick: now };
}

export function buildCost(state: GameState, id: BuildingId): Partial<Resources> {
  const info = BUILDINGS.find((x) => x.id === id)!;
  const lvl = state.buildings[id];
  const discount = 1 + totalBuffs(state).buildCostPct / 100;
  const mult = Math.pow(1.6, lvl) * discount;
  return Object.fromEntries(Object.entries(info.baseCost).map(([k, v]) => [k, Math.round((v ?? 0) * mult)]));
}

export function trainCost(state: GameState, troop: TroopId, count: number): Partial<Resources> {
  const discount = 1 + totalBuffs(state).trainCostPct / 100;
  return Object.fromEntries(
    Object.entries(TROOPS[troop].cost).map(([k, v]) => [k, Math.round((v ?? 0) * count * discount)]),
  );
}

export function canAfford(res: Resources, cost: Partial<Resources>): boolean {
  return Object.entries(cost).every(([k, v]) => res[k as ResourceId] >= (v ?? 0));
}

export function pay(res: Resources, cost: Partial<Resources>): Resources {
  const out = { ...res };
  for (const [k, v] of Object.entries(cost)) out[k as ResourceId] -= v ?? 0;
  return out;
}

export function gain(res: Resources, reward: Partial<Resources>, cap: number): Resources {
  const out = { ...res };
  for (const [k, v] of Object.entries(reward)) {
    const key = k as ResourceId;
    out[key] = key === "celik" ? out[key] + (v ?? 0) : Math.min(cap, out[key] + (v ?? 0));
  }
  return out;
}

export function maxBuildingLevel(state: GameState, id: BuildingId): number {
  return id === "otag" ? 30 : state.buildings.otag + 1;
}

export function heroXpToNext(level: number): number {
  return 50 + level * 40;
}

export function heroLevelUpCost(level: number): number {
  return 10 + level * 8;
}

export function isHeroUnlocked(state: GameState, id: string): boolean {
  return Boolean(state.heroes[id]) && Boolean(HERO_BY_ID[id]);
}

/* ------------------------------------------------------------------ paths, eras, spoils and akıncı houses */

export const OCAK_CAVALRY = 3;
export const OCAK_SPOILS = 5;
export const OCAK_MAX = 10;

export function currentPath(state: GameState): Path | null {
  return state.path ? PATH_BY_ID[state.path] ?? null : null;
}

export function currentEra(state: GameState): Era | null {
  const p = currentPath(state);
  return p ? p.eras[Math.min(state.era, p.eras.length - 1)] : null;
}

export function ocakLevels(state: GameState): number {
  return Object.values(state.ocaks).reduce((a, b) => a + b, 0);
}

/** Multiplier on gold from gaza and hunting: caravanserai, camels, akıncı houses and gold bonuses. */
export function spoilsMult(state: GameState): number {
  const b = totalBuffs(state);
  return 1 + 0.1 * state.buildings.kervansaray + Math.min(30, 3 * state.herds.deve) / 100 + (OCAK_SPOILS * ocakLevels(state)) / 100 + b.altinPct / 100;
}

export function ocakCost(level: number): Partial<Resources> {
  const m = Math.pow(1.6, level);
  return { altin: Math.round(300 * m), azik: Math.round(400 * m), demir: Math.round(80 * m) };
}

/** Era index in which a fort becomes a goal; forts of the current and earlier eras can be attacked. */
export function fortEra(path: Path, fortId: string): number {
  const i = path.eras.findIndex((e) => e.goal.forts?.includes(fortId));
  return i < 0 ? 0 : i;
}

export interface GoalLine {
  key: "goalForts" | "goalUnions" | "goalHunts" | "goalOtag" | "goalWave";
  have: number;
  need: number;
}

export function eraGoals(state: GameState): GoalLine[] {
  const era = currentEra(state);
  if (!era) return [];
  const g = era.goal;
  const out: GoalLine[] = [];
  if (g.forts) out.push({ key: "goalForts", have: g.forts.filter((f) => state.forts.includes(f)).length, need: g.forts.length });
  if (g.unions !== undefined) {
    if (typeof g.unions === "number") out.push({ key: "goalUnions", have: Math.min(g.unions, state.conquered.length), need: g.unions });
    else out.push({ key: "goalUnions", have: g.unions.filter((u) => state.conquered.includes(u)).length, need: g.unions.length });
  }
  if (g.hunts) out.push({ key: "goalHunts", have: Math.min(g.hunts, state.huntsWon), need: g.hunts });
  if (g.otag) out.push({ key: "goalOtag", have: Math.min(g.otag, state.buildings.otag), need: g.otag });
  if (g.wave) out.push({ key: "goalWave", have: Math.min(g.wave, state.defenseWave - 1), need: g.wave });
  return out;
}

export function eraComplete(state: GameState): boolean {
  return !state.founded && eraGoals(state).every((g) => g.have >= g.need);
}

/** Heroes who have joined by the current era: rulers, companions and commanders of raised houses. */
export function joinedHeroes(state: GameState): string[] {
  const p = currentPath(state);
  if (!p) return [];
  const out: string[] = [];
  p.eras.slice(0, state.era + 1).forEach((e) => {
    for (const h of [e.ruler, ...e.companions]) if (h && HERO_BY_ID[h] && !out.includes(h)) out.push(h);
  });
  for (const o of p.ocaks) {
    if (!state.ocaks[o.id]) continue;
    for (const c of o.commanders) if (c.era <= state.era && !out.includes(c.hero)) out.push(c.hero);
  }
  return out;
}

/** Commander of a house in the current era (the latest who has come of age). */
export function ocakCommander(state: GameState, ocakId: string): string | null {
  const o = currentPath(state)?.ocaks.find((x) => x.id === ocakId);
  if (!o) return null;
  const ready = o.commanders.filter((c) => c.era <= state.era);
  return ready.length ? ready[ready.length - 1].hero : null;
}
