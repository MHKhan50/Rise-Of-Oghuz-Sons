import { BUILDINGS, HERO_BY_ID, STATES, TRIBE_BY_ID, TROOPS } from "../data/oghuzData";
import type { BuildingId, Buffs, GameState, ResourceId, Resources, TroopId } from "../types/game";

export const RESOURCE_IDS: ResourceId[] = ["azik", "kereste", "tas", "demir", "altin", "celik"];
export const TROOP_IDS: TroopId[] = ["azap", "okcu", "sipahi"];
export const SAVE_VERSION = 2;
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
    heroes: { osman: { level: 1, xp: 0 } },
    conquered: [],
    towers: [null, null, null, null, null, null],
    towerLevels: [1, 1, 1, 1, 1, 1],
    defenseWave: 1,
    huntCooldowns: {},
    log: [],
    squad: ["osman"],
    toyUntil: 0,
    lastToy: 0,
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
    altin: rate(0.35 * lv.otag + 0.3 * lv.kervansaray + 0.06 * state.herds.deve, b.altinPct),
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
