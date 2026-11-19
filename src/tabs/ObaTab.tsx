import { Hammer, PartyPopper, Swords } from "lucide-react";
import { useState } from "react";
import { Button, Card, CostLine, SectionTitle, fmt } from "../components/ui";
import { BUILDINGS, TROOPS } from "../data/oghuzData";
import { unitsAt } from "../data/eras";
import { currentPath } from "../engine/economy";
import {
  TOY_COOLDOWN_MS,
  TROOP_IDS,
  armyCap,
  armySize,
  buildCost,
  canAfford,
  maxBuildingLevel,
  trainCost,
} from "../engine/economy";
import { useI18n } from "../i18n";
import type { Action } from "../state/useGame";
import type { GameState, TroopId } from "../types/game";

export function duration(ms: number): string {
  const m = Math.max(1, Math.ceil(ms / 60000));
  if (m >= 1440) return `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h`;
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

export function ObaTab({ state, act, now }: { state: GameState; act: (a: Action) => void; now: number }) {
  const { t, tx } = useI18n();
  const [count, setCount] = useState(10);
  const room = armyCap(state) - Math.ceil(armySize(state));
  const units = unitsAt(currentPath(state), state.era);
  const toyActive = now < state.toyUntil;
  const toyWait = state.lastToy + TOY_COOLDOWN_MS - now;
  return (
    <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
      <Card>
        <SectionTitle title={t("buildingsTitle")} sub={t("buildingsSub")} />
        <div className="grid gap-2 sm:grid-cols-2">
          {BUILDINGS.map((b) => {
            const lvl = state.buildings[b.id];
            const max = maxBuildingLevel(state, b.id);
            const cost = buildCost(state, b.id);
            return (
              <div key={b.id} className="rounded-lg border border-stone-700 bg-stone-950/60 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold">{b.name}</span>
                    <span className="ms-1 text-xs text-stone-400">{tx(b.label)}</span>
                  </div>
                  <span className="rounded bg-kayi-blue px-1.5 text-xs font-bold">
                    {t("level")} {lvl}
                  </span>
                </div>
                <p className="text-xs text-stone-400">{tx(b.text)}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  {lvl >= max ? (
                    <span className="text-xs text-stone-500">{b.id === "otag" ? t("maxLevel") : t("raiseOtag")}</span>
                  ) : (
                    <CostLine cost={cost} have={state.resources} />
                  )}
                  <Button small onClick={() => act({ type: "build", id: b.id })} disabled={lvl >= max || !canAfford(state.resources, cost)}>
                    <span className="flex items-center gap-1">
                      <Hammer size={12} /> {lvl === 0 ? t("build") : t("upgrade")}
                    </span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <div className="flex flex-col gap-3">
        <Card>
          <SectionTitle title={t("trainTitle")} sub={t("trainSub")} />
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            {t("batch")}
            {[5, 10, 25, 50].map((n) => (
              <Button key={n} small tone={count === n ? "blue" : "ghost"} onClick={() => setCount(n)}>
                {n}
              </Button>
            ))}
            <span className="text-stone-400">
              {t("room")} {fmt(Math.max(0, room))}
            </span>
          </div>
          {TROOP_IDS.map((tr: TroopId) => {
            const n = Math.max(0, Math.min(count, room));
            const cost = trainCost(state, tr, Math.max(1, n));
            const locked = tr === "sipahi" && state.buildings.ahir < 1;
            return (
              <div key={tr} className="mb-2 rounded-lg border border-stone-700 bg-stone-950/60 p-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span>
                    <b>{units[tr]?.name ?? TROOPS[tr].name}</b>{" "}
                    <span className="text-xs text-stone-400">
                      {tx(TROOPS[tr].label)} · {t("power")} {TROOPS[tr].power}
                    </span>
                  </span>
                  <span className="text-xs">
                    {fmt(state.troops[tr])} {t("ready")} · {fmt(state.wounded[tr])} {t("wounded")}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  {locked ? <span className="text-xs text-stone-500">{t("needStables")}</span> : <CostLine cost={cost} have={state.resources} />}
                  <Button small tone="red" onClick={() => act({ type: "train", troop: tr, count: n })} disabled={locked || n === 0 || !canAfford(state.resources, cost)}>
                    <span className="flex items-center gap-1">
                      <Swords size={12} /> {t("train", { n })}
                    </span>
                  </Button>
                </div>
              </div>
            );
          })}
        </Card>
        <Card>
          <SectionTitle title={t("feastTitle")} sub={t("feastNote")} />
          {toyActive ? (
            <p className="text-sm text-steppe-green">{t("feastRunning", { t: duration(state.toyUntil - now) })}</p>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-stone-400">{toyWait > 0 ? t("feastWait", { t: duration(toyWait) }) : t("feastHint")}</span>
              <Button small tone="green" onClick={() => act({ type: "toy", now: Date.now() })} disabled={toyWait > 0 || state.resources.azik < 300}>
                <span className="flex items-center gap-1">
                  <PartyPopper size={12} /> {t("holdFeast")}
                </span>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
