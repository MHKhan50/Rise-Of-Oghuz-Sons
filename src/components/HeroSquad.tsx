import { Crown, Lock } from "lucide-react";
import { useState } from "react";
import { HEROES, HERO_BY_ID, TRIBE_BY_ID, TROOPS } from "../data/oghuzData";
import { heroEra, pathHeroes } from "../data/eras";
import { currentPath, heroLevelUpCost, heroXpToNext } from "../engine/economy";
import { useI18n } from "../i18n";
import type { Action } from "../state/useGame";
import type { GameState, Hero } from "../types/game";
import { HeroPortrait } from "./HeroPortrait";
import { Button, Card, Confidence, CostLine, SectionTitle } from "./ui";

export function heroEffect(h: Hero, level: number, troopLabel: (h: Hero) => string): string {
  return `+${h.power + (level - 1) * 2}% ${troopLabel(h)}`;
}

export function HeroSquad({ state, act }: { state: GameState; act: (a: Action) => void }) {
  const { t, tx } = useI18n();
  const [showAllies, setShowAllies] = useState(false);
  const troopLabel = (h: Hero) => (h.troop === "support" ? t("army").toLowerCase() : tx(TROOPS[h.troop].label).toLowerCase());
  const path = currentPath(state);
  const own = path ? pathHeroes(path).filter((id) => HERO_BY_ID[id]) : [];
  const allies = HEROES.filter((h) => !own.includes(h.id));
  const joinedFirst = [...own].sort((a, b) => Number(!state.heroes[a]) - Number(!state.heroes[b]));

  const card = (h: Hero) => {
    const hs = state.heroes[h.id];
    const inSquad = state.squad.includes(h.id);
    const isOwn = own.includes(h.id);
    const joinEra = path && isOwn ? (heroEra(path, h.id) ?? path.ocaks.flatMap((o) => o.commanders).find((c) => c.hero === h.id)?.era ?? 0) : null;
    return (
      <div key={h.id} className={`flex gap-2 rounded-lg border p-2 text-xs ${inSquad ? "border-kayi-gold bg-kayi-gold/10" : "border-stone-700 bg-stone-950/60"} ${!hs && isOwn ? "opacity-60" : ""}`}>
        <HeroPortrait hero={h} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-sm font-semibold">
            {inSquad && <Crown size={14} className="text-kayi-gold" />}
            {h.name}
            {h.conf && h.conf !== "verified" && <Confidence level={h.conf} />}
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
          ) : isOwn ? (
            <div className="mt-1 flex items-center gap-1 text-stone-400">
              <Lock size={12} /> {t("heroFuture", { n: (joinEra ?? 0) + 1 })}
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
  };

  return (
    <Card>
      <SectionTitle title={t("heroesTitle")} sub={t("heroesSub")} />
      {own.length > 0 && (
        <>
          <h4 className="mb-1 text-sm font-semibold text-kayi-gold">{t("heroesPath")}</h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{joinedFirst.map((id) => card(HERO_BY_ID[id]))}</div>
        </>
      )}
      <button type="button" className="mt-3 text-sm font-semibold text-kayi-gold underline" onClick={() => setShowAllies((x) => !x)}>
        {t("heroesAllied")} ({allies.length}) {showAllies ? "▴" : "▾"}
      </button>
      {showAllies && <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{allies.map(card)}</div>}
    </Card>
  );
}
