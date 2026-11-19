import { useCallback, useEffect, useReducer } from "react";
import { BEASTS, HERO_BY_ID, STATES, TOWERS } from "../data/oghuzData";
import { huntPower, resolveBattle } from "../engine/combat";
import {
  MAX_OFFLINE_SECONDS,
  SAVE_VERSION,
  TOY_COOLDOWN_MS,
  TOY_DURATION_MS,
  TROOP_IDS,
  armyCap,
  armySize,
  buildCost,
  canAfford,
  gain,
  heroLevelUpCost,
  heroXpToNext,
  herdCap,
  maxBuildingLevel,
  newGame,
  pay,
  storageCap,
  tick,
  trainCost,
} from "../engine/economy";
import { HERDS } from "../data/oghuzData";
import type { BattleReport, BuildingId, GameState, HerdId, Resources, TowerType, TroopId } from "../types/game";

const SAVE_KEY = "rise-of-oghuz-sons-save";

export type Action =
  | { type: "tick"; now: number }
  | { type: "chooseTribe"; tribe: string }
  | { type: "build"; id: BuildingId }
  | { type: "train"; troop: TroopId; count: number }
  | { type: "buyHerd"; herd: HerdId }
  | { type: "hunt"; beast: string; now: number; luck: number }
  | { type: "attack"; stateId: string; luck: number; now: number }
  | { type: "unlockHero"; id: string }
  | { type: "levelHero"; id: string }
  | { type: "toggleSquad"; id: string }
  | { type: "toy"; now: number }
  | { type: "placeTower"; slot: number; tower: TowerType }
  | { type: "upgradeTower"; slot: number }
  | { type: "defenseDone"; won: boolean; leaked: number; now: number }
  | { type: "reset"; now: number };

function addLog(state: GameState, report: Omit<BattleReport, "at">, now: number): BattleReport[] {
  return [{ ...report, at: now }, ...state.log].slice(0, 30);
}

function addHeroXp(state: GameState, baseXp: number): GameState["heroes"] {
  const xp = baseXp * (1 + 0.1 * state.buildings.medrese);
  const heroes = { ...state.heroes };
  for (const id of state.squad) {
    const h = heroes[id];
    if (!h) continue;
    let { level, xp: cur } = h;
    cur += xp;
    while (cur >= heroXpToNext(level) && level < 60) {
      cur -= heroXpToNext(level);
      level += 1;
    }
    heroes[id] = { level, xp: cur };
  }
  return heroes;
}

export function towerCost(tower: TowerType, level: number): Partial<Resources> {
  const mult = Math.pow(1.7, level - 1);
  return Object.fromEntries(Object.entries(TOWERS[tower].cost).map(([k, v]) => [k, Math.round((v ?? 0) * mult)]));
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "tick": {
      const seconds = Math.min(MAX_OFFLINE_SECONDS, (action.now - state.lastTick) / 1000);
      return tick(state, seconds, action.now);
    }
    case "chooseTribe":
      return { ...state, tribe: action.tribe };
    case "build": {
      if (state.buildings[action.id] >= maxBuildingLevel(state, action.id)) return state;
      const cost = buildCost(state, action.id);
      if (!canAfford(state.resources, cost)) return state;
      return {
        ...state,
        resources: pay(state.resources, cost),
        buildings: { ...state.buildings, [action.id]: state.buildings[action.id] + 1 },
      };
    }
    case "train": {
      if (action.troop === "sipahi" && state.buildings.ahir < 1) return state;
      const room = armyCap(state) - Math.ceil(armySize(state));
      const count = Math.min(action.count, room);
      if (count <= 0) return state;
      const cost = trainCost(state, action.troop, count);
      if (!canAfford(state.resources, cost)) return state;
      return {
        ...state,
        resources: pay(state.resources, cost),
        troops: { ...state.troops, [action.troop]: state.troops[action.troop] + count },
      };
    }
    case "buyHerd": {
      const total = state.herds.koyun + state.herds.at + state.herds.deve;
      const cost = { altin: HERDS[action.herd].cost * (1 + 0.15 * state.herds[action.herd]) };
      if (total >= herdCap(state) || !canAfford(state.resources, cost)) return state;
      return {
        ...state,
        resources: pay(state.resources, { altin: Math.round(cost.altin) }),
        herds: { ...state.herds, [action.herd]: state.herds[action.herd] + 1 },
      };
    }
    case "hunt": {
      const beast = BEASTS.find((b) => b.id === action.beast);
      if (!beast) return state;
      if ((state.huntCooldowns[beast.id] ?? 0) > action.now) return state;
      const power = huntPower(state) * action.luck;
      const win = power >= beast.power;
      const lossShare = win ? Math.min(0.25, 0.12 * (beast.power / power)) : 0.3;
      const troops = { ...state.troops };
      const wounded = { ...state.wounded };
      for (const t of TROOP_IDS) {
        const lost = Math.floor(troops[t] * lossShare);
        troops[t] -= lost;
        wounded[t] += Math.floor(lost * 0.8);
      }
      const next = { ...state, troops, wounded };
      return {
        ...next,
        resources: win ? gain(state.resources, beast.reward, storageCap(state)) : state.resources,
        heroes: win ? addHeroXp(state, beast.xp) : state.heroes,
        huntCooldowns: { ...state.huntCooldowns, [beast.id]: action.now + beast.cooldownMin * 60_000 },
        log: addLog(state, {
          title: { k: "logHunt", v: { beastId: beast.id } },
          win,
          lines: [
            { k: "logHuntPower", v: { p: Math.round(power), b: beast.power } },
            win ? { k: "logSpoils", v: { g: beast.reward.altin ?? 0, i: beast.reward.demir ?? 0, s: beast.reward.celik ?? 0 } } : { k: "logEscaped" },
          ],
        }, action.now),
      };
    }
    case "attack": {
      const target = STATES.find((s) => s.id === action.stateId);
      if (!target || state.conquered.includes(target.id)) return state;
      const result = resolveBattle(state, target.defenders, action.luck);
      const troops = { ...state.troops };
      const wounded = { ...state.wounded };
      for (const t of TROOP_IDS) {
        troops[t] = Math.max(0, troops[t] - result.losses[t] - result.wounded[t]);
        wounded[t] += result.wounded[t];
      }
      const spoils = { altin: 150 * target.tier, celik: 5 * target.tier, demir: 60 * target.tier };
      return {
        ...state,
        troops,
        wounded,
        conquered: result.win ? [...state.conquered, target.id] : state.conquered,
        resources: result.win ? gain(state.resources, spoils, storageCap(state)) : state.resources,
        heroes: addHeroXp(state, result.win ? 40 * target.tier : 10),
        log: addLog(state, {
          title: { k: result.win ? "logConquered" : "logRepelled", v: { name: target.name } },
          win: result.win,
          lines: [
            { k: "attackVs", v: { a: Math.round(result.attack), d: Math.round(result.defence) } },
            { k: "logLosses", v: { l: TROOP_IDS.reduce((a, t) => a + result.losses[t], 0), w: TROOP_IDS.reduce((a, t) => a + result.wounded[t], 0) } },
            result.win ? { k: "logSpoils", v: { g: spoils.altin, i: spoils.demir, s: spoils.celik } } : { k: "logTryAgain" },
          ],
        }, action.now),
      };
    }
    case "unlockHero": {
      const hero = HERO_BY_ID[action.id];
      if (!hero || state.heroes[action.id]) return state;
      const cost = { altin: hero.unlockCost };
      if (!canAfford(state.resources, cost)) return state;
      return { ...state, resources: pay(state.resources, cost), heroes: { ...state.heroes, [action.id]: { level: 1, xp: 0 } } };
    }
    case "levelHero": {
      const h = state.heroes[action.id];
      if (!h) return state;
      const cost = { celik: heroLevelUpCost(h.level) };
      if (!canAfford(state.resources, cost)) return state;
      return { ...state, resources: pay(state.resources, cost), heroes: { ...state.heroes, [action.id]: { level: h.level + 1, xp: h.xp } } };
    }
    case "toggleSquad": {
      if (!state.heroes[action.id]) return state;
      if (state.squad.includes(action.id)) return { ...state, squad: state.squad.filter((x) => x !== action.id) };
      if (state.squad.length >= 3) return state;
      return { ...state, squad: [...state.squad, action.id] };
    }
    case "toy": {
      if (action.now - state.lastToy < TOY_COOLDOWN_MS) return state;
      const cost = { azik: 300 };
      if (!canAfford(state.resources, cost)) return state;
      return { ...state, resources: pay(state.resources, cost), toyUntil: action.now + TOY_DURATION_MS, lastToy: action.now };
    }
    case "placeTower": {
      if (state.towers[action.slot]) return state;
      const cost = towerCost(action.tower, 1);
      if (!canAfford(state.resources, cost)) return state;
      const towers = [...state.towers];
      towers[action.slot] = action.tower;
      const towerLevels = [...state.towerLevels];
      towerLevels[action.slot] = 1;
      return { ...state, resources: pay(state.resources, cost), towers, towerLevels };
    }
    case "upgradeTower": {
      const tower = state.towers[action.slot];
      if (!tower) return state;
      const level = state.towerLevels[action.slot];
      if (level >= 10) return state;
      const cost = towerCost(tower, level + 1);
      if (!canAfford(state.resources, cost)) return state;
      const towerLevels = [...state.towerLevels];
      towerLevels[action.slot] = level + 1;
      return { ...state, resources: pay(state.resources, cost), towerLevels };
    }
    case "defenseDone": {
      const wave = state.defenseWave;
      const reward = { altin: 80 + 40 * wave, kereste: 100 + 30 * wave, celik: 2 + Math.floor(wave / 2) };
      return {
        ...state,
        defenseWave: action.won ? wave + 1 : wave,
        resources: action.won ? gain(state.resources, reward, storageCap(state)) : state.resources,
        heroes: action.won ? addHeroXp(state, 15 + 5 * wave) : state.heroes,
        log: addLog(state, {
          title: { k: "logWave", v: { n: wave } },
          win: action.won,
          lines: [
            { k: "logLeaked", v: { n: action.leaked } },
            action.won ? { k: "logWaveRewards", v: { g: reward.altin, w: reward.kereste, s: reward.celik } } : { k: "logBuildTowers" },
          ],
        }, action.now),
      };
    }
    case "reset":
      return newGame(action.now);
  }
}

function load(now: number): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return newGame(now);
    const saved = JSON.parse(raw) as GameState;
    if (saved.version !== SAVE_VERSION) return newGame(now);
    const merged = { ...newGame(now), ...saved };
    // Offline progress, capped at eight hours.
    return reducer(merged, { type: "tick", now });
  } catch {
    return newGame(now);
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => load(Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: "tick", now: Date.now() }), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: the game still runs, progress is kept in memory */
    }
  }, [state]);

  const act = useCallback((a: Action) => dispatch(a), []);
  return { state, act };
}
