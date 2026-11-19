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
import { PATH_BY_ID, fortDefenders, pathHeroes } from "../data/eras";
import { OCAK_MAX, currentPath, eraComplete, fortEra, joinedHeroes, ocakCost, spoilsMult } from "../engine/economy";
import type { BattleReport, BuildingId, GameState, HerdId, Resources, TowerType, TroopId } from "../types/game";

const SAVE_KEY = "rise-of-oghuz-sons-save";

export type Action =
  | { type: "tick"; now: number }
  | { type: "chooseTribe"; tribe: string }
  | { type: "choosePath"; path: string }
  | { type: "gaza"; fortId: string; luck: number; now: number }
  | { type: "nextEra"; now: number }
  | { type: "raiseOcak"; id: string }
  | { type: "build"; id: BuildingId }
  | { type: "train"; troop: TroopId; count: number }
  | { type: "buyHerd"; herd: HerdId }
  | { type: "hunt"; beast: string; now: number; luck: number }
  | { type: "unite"; stateId: string; now: number }
  | { type: "unlockHero"; id: string }
  | { type: "levelHero"; id: string }
  | { type: "toggleSquad"; id: string }
  | { type: "toy"; now: number }
  | { type: "placeTower"; slot: number; tower: TowerType }
  | { type: "upgradeTower"; slot: number }
  | { type: "defenseDone"; won: boolean; leaked: number; now: number }
  | { type: "reset"; now: number };

export function unionGift(tier: number): number {
  return 100 * tier;
}

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

/** Give every hero who has joined by the current era a place in the roster; fill an empty squad. */
function syncHeroes(state: GameState): GameState {
  const heroes = { ...state.heroes };
  const joined = joinedHeroes(state);
  for (const id of joined) if (!heroes[id]) heroes[id] = { level: 1, xp: 0 };
  const squad = state.squad.length ? state.squad : joined.slice(0, 3);
  return { ...state, heroes, squad };
}

/** Gold scaled by caravanserai, camels and akıncı houses; other resources unchanged. */
function withSpoils(state: GameState, reward: Partial<Resources>): Partial<Resources> {
  return reward.altin ? { ...reward, altin: Math.round(reward.altin * spoilsMult(state)) } : reward;
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
    case "choosePath": {
      if (!PATH_BY_ID[action.path] || state.path) return state;
      return syncHeroes({ ...state, path: action.path, era: 0, squad: [] });
    }
    case "nextEra": {
      const path = currentPath(state);
      if (!path || !eraComplete(state)) return state;
      const last = state.era >= path.eras.length - 1;
      const next = last ? { ...state, founded: true } : { ...state, era: state.era + 1 };
      const era = path.eras[next.era];
      return syncHeroes({
        ...next,
        log: addLog(state, {
          title: last ? { k: "logFounded", v: { pathId: path.id } } : { k: "logEra", v: { pathId: path.id, eraIdx: next.era, years: era.years } },
          win: true,
          lines: last ? [] : [{ k: "logEraHeroes", v: { n: [era.ruler, ...era.companions].filter(Boolean).length } }],
        }, action.now),
      });
    }
    case "raiseOcak": {
      const path = currentPath(state);
      const o = path?.ocaks.find((x) => x.id === action.id);
      if (!o || o.commanders[0].era > state.era) return state;
      const lvl = state.ocaks[o.id] ?? 0;
      if (lvl >= OCAK_MAX) return state;
      const cost = ocakCost(lvl);
      if (!canAfford(state.resources, cost)) return state;
      return syncHeroes({ ...state, resources: pay(state.resources, cost), ocaks: { ...state.ocaks, [o.id]: lvl + 1 } });
    }
    case "gaza": {
      const path = currentPath(state);
      const f = path?.forts.find((x) => x.id === action.fortId);
      if (!path || !f || state.forts.includes(f.id) || fortEra(path, f.id) > state.era) return state;
      const result = resolveBattle(state, fortDefenders(f), action.luck);
      const troops = { ...state.troops };
      const wounded = { ...state.wounded };
      for (const t of TROOP_IDS) {
        troops[t] = Math.max(0, troops[t] - result.losses[t] - result.wounded[t]);
        wounded[t] += result.wounded[t];
      }
      const spoils = withSpoils(state, { altin: 200 * f.tier, demir: 50 * f.tier, celik: 5 * f.tier });
      return {
        ...state,
        troops,
        wounded,
        forts: result.win ? [...state.forts, f.id] : state.forts,
        resources: result.win ? gain(state.resources, spoils, storageCap(state)) : state.resources,
        heroes: addHeroXp(state, result.win ? 40 * f.tier : 10),
        log: addLog(state, {
          title: { k: result.win ? "logConquered" : "logRepelled", v: { name: f.name } },
          win: result.win,
          lines: [
            { k: "attackVs", v: { a: Math.round(result.attack), d: Math.round(result.defence) } },
            { k: "logLosses", v: { l: TROOP_IDS.reduce((a, t) => a + result.losses[t], 0), w: TROOP_IDS.reduce((a, t) => a + result.wounded[t], 0) } },
            result.win ? { k: "logSpoils", v: { g: spoils.altin ?? 0, i: spoils.demir ?? 0, s: spoils.celik ?? 0 } } : { k: "logTryAgain" },
          ],
        }, action.now),
      };
    }
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
      const reward = withSpoils(state, beast.reward);
      return {
        ...next,
        huntsWon: win ? state.huntsWon + 1 : state.huntsWon,
        resources: win ? gain(state.resources, reward, storageCap(state)) : state.resources,
        heroes: win ? addHeroXp(state, beast.xp) : state.heroes,
        huntCooldowns: { ...state.huntCooldowns, [beast.id]: action.now + beast.cooldownMin * 60_000 },
        log: addLog(state, {
          title: { k: "logHunt", v: { beastId: beast.id } },
          win,
          lines: [
            { k: "logHuntPower", v: { p: Math.round(power), b: beast.power } },
            win ? { k: "logSpoils", v: { g: reward.altin ?? 0, i: reward.demir ?? 0, s: reward.celik ?? 0 } } : { k: "logEscaped" },
          ],
        }, action.now),
      };
    }
    case "unite": {
      // Muslim and Turkic states join by alliance: show enough strength, send gifts, no blood is shed.
      const target = STATES.find((x) => x.id === action.stateId);
      if (!target || state.conquered.includes(target.id)) return state;
      const result = resolveBattle(state, target.defenders, 1);
      const gift = { altin: unionGift(target.tier) };
      if (!result.win || !canAfford(state.resources, gift)) return state;
      return {
        ...state,
        resources: pay(state.resources, gift),
        conquered: [...state.conquered, target.id],
        log: addLog(state, { title: { k: "logUnited", v: { name: target.name } }, win: true, lines: [{ k: "logGift", v: { g: gift.altin } }] }, action.now),
      };
    }
    case "unlockHero": {
      const hero = HERO_BY_ID[action.id];
      if (!hero || state.heroes[action.id]) return state;
      // Rulers and companions of your own path join with their era and cannot be bought early.
      const path = currentPath(state);
      if (path && pathHeroes(path).includes(hero.id)) return state;
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
    const merged = syncHeroes({ ...newGame(now), ...saved });
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
