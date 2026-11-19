import { HERO_BY_ID, TROOPS } from "../data/oghuzData";
import type { GameState, TroopId, Troops } from "../types/game";
import { TROOP_IDS, totalBuffs } from "./economy";

export const COUNTER_BONUS = 1.25;
export const COUNTERED_PENALTY = 0.8;

/** Hero bonuses per troop type and overall, scaled by hero level. */
export function heroBonus(state: GameState): { troop: Record<TroopId, number>; all: number; hunt: number; defense: number; tower: number } {
  const out = { troop: { azap: 0, okcu: 0, sipahi: 0 } as Record<TroopId, number>, all: 0, hunt: 0, defense: 0, tower: 0 };
  for (const id of state.squad) {
    const hero = HERO_BY_ID[id];
    const hs = state.heroes[id];
    if (!hero || !hs) continue;
    const pct = hero.power + (hs.level - 1) * 2;
    if (hero.troop === "support") out.all += pct;
    else out.troop[hero.troop] += pct;
    if (id === "salurkazan") out.hunt += 25;
    if (id === "nuraddin") out.defense += 10;
    if (id === "fatih") out.tower += 15;
    if (id === "orhan") out.tower += 8;
  }
  return out;
}

/** Strength of each troop type in the player's army, with tribe, tribute, herd and hero bonuses. */
export function playerStrength(state: GameState, troops: Troops = state.troops): Record<TroopId, number> {
  const b = totalBuffs(state);
  const h = heroBonus(state);
  const horses = Math.min(30, state.herds.at);
  const faith = 2 * state.buildings.cami;
  const pct: Record<TroopId, number> = {
    azap: b.infantryPct + h.troop.azap + h.all + faith,
    okcu: b.archerPct + h.troop.okcu + h.all + faith,
    sipahi: b.cavalryPct + h.troop.sipahi + h.all + horses + faith,
  };
  return Object.fromEntries(
    TROOP_IDS.map((t) => [t, troops[t] * TROOPS[t].power * (1 + pct[t] / 100)]),
  ) as Record<TroopId, number>;
}

export function rawStrength(troops: Troops): Record<TroopId, number> {
  return Object.fromEntries(TROOP_IDS.map((t) => [t, troops[t] * TROOPS[t].power])) as Record<TroopId, number>;
}

/**
 * Rock-paper-scissors: Infantry > Archers > Cavalry > Infantry.
 * Each side's strength in a type is multiplied by 1.25 against the share of enemy strength it beats and
 * by 0.8 against the share that beats it.
 */
export function effectivePower(mine: Record<TroopId, number>, theirs: Record<TroopId, number>): number {
  const total = TROOP_IDS.reduce((s, t) => s + theirs[t], 0) || 1;
  let power = 0;
  for (const t of TROOP_IDS) {
    for (const u of TROOP_IDS) {
      const share = theirs[u] / total;
      const mult = TROOPS[t].beats === u ? COUNTER_BONUS : TROOPS[u].beats === t ? COUNTERED_PENALTY : 1;
      power += mine[t] * share * mult;
    }
  }
  return power;
}

export interface BattleResult {
  win: boolean;
  attack: number;
  defence: number;
  losses: Troops;
  wounded: Troops;
}

/** Resolve a battle. `luck` in [0.9, 1.1] is drawn by the caller so results can be tested. */
export function resolveBattle(state: GameState, enemy: Troops, luck: number): BattleResult {
  const mine = playerStrength(state);
  const theirs = rawStrength(enemy);
  const attack = effectivePower(mine, theirs) * luck;
  const defence = effectivePower(theirs, mine);
  const win = attack > defence;
  const ratio = defence / Math.max(attack, 1);
  const lossShare = win ? Math.min(0.5, 0.35 * ratio) : Math.min(0.85, 0.45 + 0.2 * ratio);
  const losses = { azap: 0, okcu: 0, sipahi: 0 } as Troops;
  const wounded = { azap: 0, okcu: 0, sipahi: 0 } as Troops;
  for (const t of TROOP_IDS) {
    const lost = Math.floor(state.troops[t] * lossShare);
    wounded[t] = Math.floor(lost * 0.6);
    losses[t] = lost - wounded[t];
  }
  return { win, attack, defence, losses, wounded };
}

/** Hunting: beasts have no troop type, so only raw strength and hunting bonuses count. */
export function huntPower(state: GameState): number {
  const s = playerStrength(state);
  const b = totalBuffs(state);
  const h = heroBonus(state);
  return TROOP_IDS.reduce((sum, t) => sum + s[t], 0) * (1 + (b.huntPct + h.hunt) / 100);
}
