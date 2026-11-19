import { Crown } from "lucide-react";
import { HEROES, TRIBE_BY_ID, TROOPS } from "../data/oghuzData";
import { heroLevelUpCost, heroXpToNext } from "../engine/economy";
import { useI18n } from "../i18n";
import type { Action } from "../state/useGame";
import type { GameState, Hero } from "../types/game";
import { HeroPortrait } from "./HeroPortrait";
import { Button, Card, CostLine, SectionTitle } from "./ui";

export function heroEffect(h: Hero, level: number, troopLabel: (h: Hero) => string): string {
  return `+${h.power + (level - 1) * 2}% ${troopLabel(h)}`;
}

export function HeroSquad({ state, act }: { state: GameState; act: (a: Action) => void }) {
  const { t, tx } = useI18n();
  const troopLabel = (h: Hero) => (h.troop === "support" ? t("army").toLowerCase() : tx(TROOPS[h.troop].label).toLowerCase());
  return (
    <Card>
      <SectionTitle title={t("heroesTitle")} sub={t("heroesSub")} />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {HEROES.map((h) => {
          const hs = state.heroes[h.id];
          const inSquad = state.squad.includes(h.id);
          return (
            <div key={h.id} className={`flex gap-2 rounded-lg border p-2 text-xs ${inSquad ? "border-kayi-gold bg-kayi-gold/10" : "border-stone-700 bg-stone-950/60"}`}>
              <HeroPortrait hero={h} size={56} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-sm font-semibold">
                  {inSquad && <Crown size={14} className="text-kayi-gold" />}
                  {h.name}
                </div>
                <div className="text-stone-400">
                  {h.role} · {h.tribe ? t("tribeOf", { name: TRIBE_BY_ID[h.tribe].name }) : t("allyCommander")}
                </div>
                <div className="text-stone-400">{tx(h.origin)}</div>
                <div className="text-steppe-green">
                  {h.skill}: {heroEffect(h, hs?.level ?? 1, troopLabel)}
                </div>
                {hs ? (
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <span>
                      {t("level")} {hs.level} · XP {Math.floor(hs.xp)}/{heroXpToNext(hs.level)}
                    </span>
                    <Button small tone={inSquad ? "ghost" : "blue"} onClick={() => act({ type: "toggleSquad", id: h.id })} disabled={!inSquad && state.squad.length >= 3}>
                      {inSquad ? t("leaveSquad") : t("joinSquad")}
                    </Button>
                    <Button small tone="green" onClick={() => act({ type: "levelHero", id: h.id })} disabled={state.resources.celik < heroLevelUpCost(hs.level)}>
                      {t("levelUp", { n: heroLevelUpCost(hs.level) })}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <CostLine cost={{ altin: h.unlockCost }} have={state.resources} />
                    <Button small onClick={() => act({ type: "unlockHero", id: h.id })} disabled={state.resources.altin < h.unlockCost}>
                      {t("recruit")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
