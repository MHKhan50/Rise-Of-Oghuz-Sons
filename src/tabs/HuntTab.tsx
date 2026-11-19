import { Target } from "lucide-react";
import { Button, Card, CostLine, SectionTitle, fmt } from "../components/ui";
import { BEASTS, HERDS, HERO_BY_ID } from "../data/oghuzData";
import { huntPower } from "../engine/combat";
import { herdCap } from "../engine/economy";
import { useI18n } from "../i18n";
import type { Action } from "../state/useGame";
import type { GameState, HerdId, ResourceId } from "../types/game";
import { RESOURCE_INFO } from "../data/oghuzData";
import { duration } from "./ObaTab";

export function HuntTab({ state, act, now }: { state: GameState; act: (a: Action) => void; now: number }) {
  const { t, tx } = useI18n();
  const power = huntPower(state);
  const totalHerd = state.herds.koyun + state.herds.at + state.herds.deve;
  const squad = state.squad.map((id) => HERO_BY_ID[id]?.name).filter(Boolean).join(", ") || t("none");
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Card>
        <SectionTitle title={t("herdsTitle")} sub={t("herdsSub", { cap: herdCap(state), n: totalHerd })} />
        {(Object.keys(HERDS) as HerdId[]).map((h) => {
          const cost = Math.round(HERDS[h].cost * (1 + 0.15 * state.herds[h]));
          return (
            <div key={h} className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-stone-700 bg-stone-950/60 p-2 text-sm">
              <div>
                <b>{HERDS[h].name}</b> <span className="text-xs text-stone-400">{tx(HERDS[h].label)}</span>
                <div className="text-xs text-steppe-green">{tx(HERDS[h].text)}</div>
                <div className="text-xs">
                  {t("owned")}: {state.herds[h]}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <CostLine cost={{ altin: cost }} have={state.resources} />
                <Button small onClick={() => act({ type: "buyHerd", herd: h })} disabled={totalHerd >= herdCap(state) || state.resources.altin < cost}>
                  {t("buy")}
                </Button>
              </div>
            </div>
          );
        })}
      </Card>
      <Card>
        <SectionTitle title={t("huntTitle")} sub={t("huntSub", { p: fmt(power), s: squad })} />
        {BEASTS.map((b) => {
          const cd = (state.huntCooldowns[b.id] ?? 0) - now;
          const odds = power >= b.power * 1.1 ? "sureWin" : power >= b.power * 0.9 ? "evenFight" : "tooStrong";
          return (
            <div key={b.id} className={`mb-2 rounded-lg border p-2 text-sm ${b.boss ? "border-turk-red bg-turk-red/10" : "border-stone-700 bg-stone-950/60"}`}>
              <div className="flex items-center justify-between">
                <b>{tx(b.name)}</b>
                <span className="text-xs">
                  {t("power")} {b.power}
                </span>
              </div>
              <div className="text-xs text-stone-400">
                {t("rewards")}:{" "}
                {Object.entries(b.reward)
                  .map(([k, v]) => `${v} ${tx(RESOURCE_INFO[k as ResourceId].label).toLowerCase()}`)
                  .join(", ")}{" "}
                · {b.xp} {t("heroXp")}
                {b.boss ? ` · ${t("every48h")}` : ""}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className={`text-xs ${odds === "sureWin" ? "text-green-300" : odds === "evenFight" ? "text-yellow-300" : "text-red-300"}`}>{t(odds)}</span>
                <Button small tone="red" disabled={cd > 0} onClick={() => act({ type: "hunt", beast: b.id, now: Date.now(), luck: 0.9 + Math.random() * 0.2 })}>
                  <span className="flex items-center gap-1">
                    <Target size={12} /> {cd > 0 ? t("backIn", { t: duration(cd) }) : t("hunt")}
                  </span>
                </Button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
