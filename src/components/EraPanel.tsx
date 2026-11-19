import { CircleCheck, Circle, Sparkles } from "lucide-react";
import { HERO_BY_ID, TRIBE_BY_ID, TROOPS } from "../data/oghuzData";
import { bannerAt, unitsAt } from "../data/eras";
import { TROOP_IDS } from "../engine/economy";
import { EraSancak } from "./EraSancak";
import { currentEra, currentPath, eraComplete, eraGoals } from "../engine/economy";
import { useI18n } from "../i18n";
import type { Action } from "../state/useGame";
import type { GameState } from "../types/game";
import { HeroPortrait } from "./HeroPortrait";
import { Button, Card, Confidence } from "./ui";

export function EraPanel({ state, act }: { state: GameState; act: (a: Action) => void }) {
  const { t, tx } = useI18n();
  const path = currentPath(state);
  const era = currentEra(state);
  if (!path || !era) return null;
  const goals = eraGoals(state);
  const ready = eraComplete(state);
  const last = state.era >= path.eras.length - 1;
  const ruler = era.ruler ? HERO_BY_ID[era.ruler] : null;
  return (
    <Card className="border-kayi-gold/60">
      <div className="flex flex-wrap items-start gap-3">
        {ruler && <HeroPortrait hero={ruler} size={72} />}
        <div className="min-w-[12rem] flex-1">
          <div className="text-xs uppercase tracking-wide text-kayi-gold">
            {tx(path.name)} · {t("eraOf", { n: state.era + 1, total: path.eras.length })}
          </div>
          <h2 className="flex items-center gap-1 text-lg font-bold">
            {tx(era.title)} <Confidence level={era.conf} />
          </h2>
          <div className="text-xs text-stone-400">
            {era.years}
            {era.rulers.length > 0 && ` · ${era.rulers.join(" · ")}`}
          </div>
          <p className="mt-1 text-sm text-stone-300">{tx(era.note)}</p>
        </div>
        <div className="min-w-[14rem] flex-1">
          {state.founded ? (
            <p className="flex items-start gap-1 text-sm text-steppe-green">
              <Sparkles size={16} className="mt-0.5 shrink-0" /> {t("stateFounded", { name: tx(path.name) })}
            </p>
          ) : (
            <>
              <div className="mb-1 text-sm font-semibold">{t("eraGoalsTitle")}</div>
              <ul className="space-y-0.5 text-sm">
                {goals.map((g) => (
                  <li key={g.key} className={`flex items-center gap-1 ${g.have >= g.need ? "text-steppe-green" : "text-stone-300"}`}>
                    {g.have >= g.need ? <CircleCheck size={14} /> : <Circle size={14} />}
                    {t(g.key, { have: g.have, need: g.need })}
                  </li>
                ))}
              </ul>
              <div className="mt-2">
                <Button tone="green" disabled={!ready} onClick={() => act({ type: "nextEra", now: Date.now() })}>
                  {last ? t("completeState") : t("nextEra")}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-2 grid gap-2 border-t border-stone-800 pt-2 text-xs sm:grid-cols-[auto_1fr]">
        {(() => {
          const banner = bannerAt(path, state.era);
          const units = unitsAt(path, state.era);
          return (
            <>
              <div className="flex items-start gap-2 sm:max-w-xs">
                <EraSancak banner={banner} tribe={TRIBE_BY_ID[state.tribe!]} size={52} />
                <div>
                  <div className="font-semibold text-kayi-gold">{t("eraBanner")}</div>
                  {banner ? (
                    <div className="text-stone-400">
                      {tx(banner.note)} <Confidence level={banner.conf} />
                    </div>
                  ) : (
                    <div className="text-stone-400">{t("tribeBannerNote")}</div>
                  )}
                </div>
              </div>
              <div>
                <div className="font-semibold text-kayi-gold">{t("eraArmy")}</div>
                <ul className="space-y-0.5">
                  {TROOP_IDS.map((x) => {
                    const u = units[x];
                    return (
                      <li key={x} className="text-stone-300">
                        <b>{u?.name ?? TROOPS[x].name}</b> <span className="text-stone-500">({tx(TROOPS[x].label)})</span>
                        {u && (
                          <>
                            {" "}
                            <span className="text-stone-400">· {tx(u.note)}</span> <Confidence level={u.conf} />
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          );
        })()}
      </div>
      {era.companions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-stone-400">
          {t("companionsTitle")}:
          {era.companions.filter((id) => HERO_BY_ID[id]).map((id) => (
            <span key={id} className="flex items-center gap-1 rounded-full bg-stone-800 py-0.5 pe-2 ps-0.5">
              <HeroPortrait hero={HERO_BY_ID[id]} size={22} /> {HERO_BY_ID[id].name}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
