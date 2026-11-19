import { Castle } from "lucide-react";
import { useState } from "react";
import { HeroSquad } from "../components/HeroSquad";
import { TamgaFlag } from "../components/TamgaFlag";
import { WorldMap } from "../components/WorldMap";
import { Button, Card, Confidence, SectionTitle, buffText, fmt } from "../components/ui";
import { STATES, TRIBE_BY_ID, TROOPS } from "../data/oghuzData";
import { effectivePower, playerStrength, rawStrength } from "../engine/combat";
import { TROOP_IDS } from "../engine/economy";
import { useI18n } from "../i18n";
import type { Action } from "../state/useGame";
import type { GameState, HistoricalState, TroopId } from "../types/game";

function mainAndCounter(s: HistoricalState): [TroopId, TroopId] {
  const main = TROOP_IDS.reduce((a, b) => (s.defenders[a] * TROOPS[a].power >= s.defenders[b] * TROOPS[b].power ? a : b));
  const counter = TROOP_IDS.find((x) => TROOPS[x].beats === main) as TroopId;
  return [main, counter];
}

export function ConquestTab({ state, act }: { state: GameState; act: (a: Action) => void }) {
  const { t, tx } = useI18n();
  const [selected, setSelected] = useState<string>(STATES.find((s) => !state.conquered.includes(s.id))?.id ?? STATES[0].id);
  const target = STATES.find((s) => s.id === selected)!;
  const mine = playerStrength(state);
  const attack = effectivePower(mine, rawStrength(target.defenders));
  const defence = effectivePower(rawStrength(target.defenders), mine);
  const odds = attack * 0.9 > defence ? "strong" : attack * 1.1 > defence ? "risky" : "tooStrong";
  const done = state.conquered.includes(target.id);
  const player = TRIBE_BY_ID[state.tribe!];
  const [main, counter] = mainAndCounter(target);
  const banner = done ? player : target.tribeLink ? TRIBE_BY_ID[target.tribeLink] : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 lg:grid-cols-[3fr_2fr]">
        <Card>
          <SectionTitle title={t("conquestTitle", { n: state.conquered.length, total: STATES.length })} sub={`${t("conquestSub")} ${t("mapHint")}`} />
          <WorldMap conquered={state.conquered} selected={selected} onSelect={setSelected} player={player} />
          <div className="mt-2 flex flex-wrap gap-1">
            {[...STATES].sort((a, b) => a.tier - b.tier).map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`rounded border px-1.5 py-0.5 text-[11px] ${selected === s.id ? "border-kayi-gold text-kayi-gold" : "border-stone-700 text-stone-300"} ${state.conquered.includes(s.id) ? "bg-steppe-green/20" : ""}`}
              >
                {s.name} <span className="text-stone-500">{s.tier}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-start gap-2">
            {banner ? <TamgaFlag tribe={banner} size={46} conquered={done} /> : <Castle size={40} className="text-stone-500" />}
            <div className="flex-1">
              <h3 className="text-lg font-bold">{target.name}</h3>
              <div className="text-xs text-stone-400">
                {target.seat} · {target.region} · {target.era} · {t("tier")} {target.tier}
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-stone-300">{tx(target.note)}</p>
          {target.tribeLink && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              {t("linkedTribe")}: <b>{TRIBE_BY_ID[target.tribeLink].name}</b>
              {target.linkConfidence && <Confidence level={target.linkConfidence} />}
            </div>
          )}
          <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
            {TROOP_IDS.map((x) => (
              <div key={x} className="rounded bg-stone-950/60 p-1">
                <div className="text-stone-400">{tx(TROOPS[x].label)}</div>
                <div className="font-bold">{fmt(target.defenders[x])}</div>
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-kayi-gold">{t("mostly", { a: tx(TROOPS[main].label).toLowerCase(), b: tx(TROOPS[counter].label).toLowerCase() })}</p>
          <p className="text-xs text-steppe-green">
            {t("tribute")}: {buffText(target.tribute as Record<string, number>, tx)}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-sm">
              {t("attackVs", { a: fmt(attack), d: fmt(defence) })} ·{" "}
              <b className={odds === "strong" ? "text-green-300" : odds === "risky" ? "text-yellow-300" : "text-red-300"}>{t(odds)}</b>
            </span>
            <Button tone="red" disabled={done} onClick={() => act({ type: "attack", stateId: target.id, luck: 0.9 + Math.random() * 0.2, now: Date.now() })}>
              {done ? t("conquered") : t("march")}
            </Button>
          </div>
        </Card>
      </div>
      <HeroSquad state={state} act={act} />
    </div>
  );
}
