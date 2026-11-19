import { Castle, Handshake, Lock, Swords } from "lucide-react";
import { useState } from "react";
import { EraPanel } from "../components/EraPanel";
import { HeroPortrait } from "../components/HeroPortrait";
import { HeroSquad } from "../components/HeroSquad";
import { TamgaFlag } from "../components/TamgaFlag";
import { WorldMap, type MapPoint } from "../components/WorldMap";
import { Button, Card, Confidence, CostLine, SectionTitle, buffText, fmt } from "../components/ui";
import { HERO_BY_ID, STATES, TRIBE_BY_ID, TROOPS } from "../data/oghuzData";
import { HOLDERS, bannerAt, fortDefenders, type Fort } from "../data/eras";
import { effectivePower, playerStrength, rawStrength } from "../engine/combat";
import { OCAK_CAVALRY, OCAK_MAX, OCAK_SPOILS, TROOP_IDS, canAfford, currentPath, fortEra, ocakCommander, ocakCost } from "../engine/economy";
import { useI18n } from "../i18n";
import { unionGift, type Action } from "../state/useGame";
import type { GameState, TroopId, Troops } from "../types/game";

function mainAndCounter(d: Troops): [TroopId, TroopId] {
  const main = TROOP_IDS.reduce((a, b) => (d[a] * TROOPS[a].power >= d[b] * TROOPS[b].power ? a : b));
  const counter = TROOP_IDS.find((x) => TROOPS[x].beats === main) as TroopId;
  return [main, counter];
}

function Odds({ state, defenders }: { state: GameState; defenders: Troops }) {
  const { t, tx } = useI18n();
  const mine = playerStrength(state);
  const attack = effectivePower(mine, rawStrength(defenders));
  const defence = effectivePower(rawStrength(defenders), mine);
  const odds = attack * 0.9 > defence ? "strong" : attack * 1.1 > defence ? "risky" : "tooStrong";
  const [main, counter] = mainAndCounter(defenders);
  return (
    <>
      <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
        {TROOP_IDS.map((x) => (
          <div key={x} className="rounded bg-stone-950/60 p-1">
            <div className="text-stone-400">{tx(TROOPS[x].label)}</div>
            <div className="font-bold">{fmt(defenders[x])}</div>
          </div>
        ))}
      </div>
      <p className="mt-1 text-xs text-kayi-gold">{t("mostly", { a: tx(TROOPS[main].label).toLowerCase(), b: tx(TROOPS[counter].label).toLowerCase() })}</p>
      <p className="text-sm">
        {t("attackVs", { a: fmt(attack), d: fmt(defence) })} ·{" "}
        <b className={odds === "strong" ? "text-green-300" : odds === "risky" ? "text-yellow-300" : "text-red-300"}>{t(odds)}</b>
      </p>
    </>
  );
}

export function ConquestTab({ state, act }: { state: GameState; act: (a: Action) => void }) {
  const { t, tx } = useI18n();
  const path = currentPath(state)!;
  const player = TRIBE_BY_ID[state.tribe!];
  const [mode, setMode] = useState<"gaza" | "union">(path.forts.length ? "gaza" : "union");
  const firstOpenFort = path.forts.find((f) => !state.forts.includes(f.id) && fortEra(path, f.id) <= state.era) ?? path.forts[0];
  const [fortSel, setFortSel] = useState<string>(firstOpenFort?.id ?? "");
  const [stateSel, setStateSel] = useState<string>(STATES.find((s) => !state.conquered.includes(s.id))?.id ?? STATES[0].id);

  const banner = bannerAt(path, state.era);
  const red = banner && banner.kind !== "tug";
  const ownColors: [string, string] = red ? ["#c8102e", "#f5f5f4"] : player.colors;
  const emblem = banner?.kind === "redCrescent" ? "crescent" : banner?.kind === "redCrescentStar" ? "crescentStar" : undefined;
  const fortPoints: MapPoint[] = path.forts.map((f) => {
    const own = state.forts.includes(f.id);
    return {
      id: f.id, name: f.name, lonLat: f.lonLat, battle: f.battle, own, locked: fortEra(path, f.id) > state.era,
      colors: own ? ownColors : HOLDERS[f.holder].colors,
      tamgaOf: own && !red ? player.id : undefined,
      emblem: own ? emblem : undefined,
    };
  });
  const statePoints: MapPoint[] = STATES.map((s) => {
    const won = state.conquered.includes(s.id);
    const tr = won ? player : s.tribeLink ? TRIBE_BY_ID[s.tribeLink] : undefined;
    return { id: s.id, name: s.name, lonLat: s.lonLat, own: won, colors: tr ? tr.colors : ["#57534e", "#a8a29e"], tamgaOf: tr?.id };
  });

  const fort: Fort | undefined = path.forts.find((f) => f.id === fortSel);
  const target = STATES.find((s) => s.id === stateSel)!;

  return (
    <div className="flex flex-col gap-3">
      <EraPanel state={state} act={act} />
      <div className="flex gap-2">
        {path.forts.length > 0 && (
          <Button tone={mode === "gaza" ? "red" : "ghost"} onClick={() => setMode("gaza")}>
            <span className="flex items-center gap-1"><Swords size={14} /> {t("gazaTab")} · {state.forts.filter((f) => path.forts.some((x) => x.id === f)).length}/{path.forts.length}</span>
          </Button>
        )}
        <Button tone={mode === "union" ? "green" : "ghost"} onClick={() => setMode("union")}>
          <span className="flex items-center gap-1"><Handshake size={14} /> {t("unionTab")} · {state.conquered.length}/{STATES.length}</span>
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[3fr_2fr]">
        <Card>
          <SectionTitle title={mode === "gaza" ? t("gazaTab") : t("unionTab")} sub={`${mode === "gaza" ? t("gazaSub") : t("unionSub")} ${t("mapHint")}`} />
          <WorldMap
            points={mode === "gaza" ? fortPoints : statePoints}
            selected={mode === "gaza" ? fortSel : stateSel}
            onSelect={mode === "gaza" ? setFortSel : setStateSel}
            label={mode === "gaza" ? t("gazaTab") : t("unionTab")}
            fit={mode === "gaza"}
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {mode === "gaza"
              ? path.forts.map((f) => {
                  const locked = fortEra(path, f.id) > state.era;
                  return (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setFortSel(f.id)}
                      className={`rounded border px-1.5 py-0.5 text-[11px] ${fortSel === f.id ? "border-kayi-gold text-kayi-gold" : "border-stone-700 text-stone-300"} ${state.forts.includes(f.id) ? "bg-steppe-green/20" : ""} ${locked ? "opacity-40" : ""}`}
                    >
                      {f.name} <span className="text-stone-500">{f.year}</span>
                    </button>
                  );
                })
              : [...STATES].sort((a, b) => a.tier - b.tier).map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setStateSel(s.id)}
                    className={`rounded border px-1.5 py-0.5 text-[11px] ${stateSel === s.id ? "border-kayi-gold text-kayi-gold" : "border-stone-700 text-stone-300"} ${state.conquered.includes(s.id) ? "bg-steppe-green/20" : ""}`}
                  >
                    {s.name} <span className="text-stone-500">{s.tier}</span>
                  </button>
                ))}
          </div>
        </Card>

        {mode === "gaza" && fort ? (
          <Card>
            {(() => {
              const done = state.forts.includes(fort.id);
              const lockedEra = fortEra(path, fort.id);
              const locked = lockedEra > state.era;
              const holder = HOLDERS[fort.holder];
              return (
                <>
                  <div className="flex items-start gap-2">
                    {done ? <TamgaFlag tribe={player} size={46} conquered /> : <Castle size={40} style={{ color: holder.colors[0] }} />}
                    <div className="flex-1">
                      <h3 className="flex items-center gap-1 text-lg font-bold">
                        {fort.name} <Confidence level={fort.conf} />
                      </h3>
                      <div className="text-xs text-stone-400">
                        {fort.modern ? `${fort.modern} · ` : ""}
                        {fort.battle ? `${t("battleField")} · ` : ""}
                        {t("tier")} {fort.tier}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">
                    {t("holder")}: <b>{tx(holder.name)}</b>
                  </p>
                  <p className="text-xs text-stone-400">{t("takenIn", { year: fort.year })}</p>
                  <p className="text-xs text-stone-400">{tx(path.eras[lockedEra].title)}</p>
                  <Odds state={state} defenders={fortDefenders(fort)} />
                  <div className="mt-2 flex justify-end">
                    {locked ? (
                      <span className="flex items-center gap-1 text-sm text-stone-400">
                        <Lock size={14} /> {t("fortLocked", { n: lockedEra + 1 })}
                      </span>
                    ) : (
                      <Button tone="red" disabled={done} onClick={() => act({ type: "gaza", fortId: fort.id, luck: 0.9 + Math.random() * 0.2, now: Date.now() })}>
                        {done ? t("conquered") : t("march")}
                      </Button>
                    )}
                  </div>
                </>
              );
            })()}
          </Card>
        ) : (
          <Card>
            {(() => {
              const done = state.conquered.includes(target.id);
              const banner = done ? player : target.tribeLink ? TRIBE_BY_ID[target.tribeLink] : null;
              const mine = playerStrength(state);
              const strong = effectivePower(mine, rawStrength(target.defenders)) > effectivePower(rawStrength(target.defenders), mine);
              const gift = { altin: unionGift(target.tier) };
              return (
                <>
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
                  <p className="text-xs text-steppe-green">
                    {t("tribute")}: {buffText(target.tribute as Record<string, number>, tx)}
                  </p>
                  <Odds state={state} defenders={target.defenders} />
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs">
                      {t("gifts")}: <CostLine cost={gift} have={state.resources} />
                    </span>
                    <Button tone="green" disabled={done || !strong || !canAfford(state.resources, gift)} onClick={() => act({ type: "unite", stateId: target.id, now: Date.now() })}>
                      {done ? t("united") : t("unite")}
                    </Button>
                  </div>
                  {!done && !strong && <p className="mt-1 text-xs text-red-300">{t("needStronger")}</p>}
                </>
              );
            })()}
          </Card>
        )}
      </div>

      {path.ocaks.length > 0 && (
        <Card>
          <SectionTitle title={t("ocaksTitle")} sub={t("ocaksSub", { c: OCAK_CAVALRY, s: OCAK_SPOILS })} />
          <div className="grid gap-2 sm:grid-cols-2">
            {path.ocaks.map((o) => {
              const lvl = state.ocaks[o.id] ?? 0;
              const open = o.commanders[0].era <= state.era;
              const cmd = ocakCommander(state, o.id);
              const cost = ocakCost(lvl);
              return (
                <div key={o.id} className={`flex gap-2 rounded-lg border border-stone-700 bg-stone-950/60 p-2 text-xs ${open ? "" : "opacity-50"}`}>
                  {cmd && HERO_BY_ID[cmd] ? <HeroPortrait hero={HERO_BY_ID[cmd]} size={52} /> : <Lock size={40} className="text-stone-600" />}
                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      {o.name} · {t("level")} {lvl}/{OCAK_MAX}
                    </div>
                    <div className="text-stone-400">{tx(o.text)}</div>
                    {cmd && HERO_BY_ID[cmd] && (
                      <div className="text-stone-300">
                        {t("commander")}: <b>{HERO_BY_ID[cmd].name}</b>
                      </div>
                    )}
                    <div className="text-stone-500">{o.commanders.map((c) => HERO_BY_ID[c.hero]?.name).join(" → ")}</div>
                    {open ? (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <CostLine cost={cost} have={state.resources} />
                        <Button small tone="blue" disabled={lvl >= OCAK_MAX || !canAfford(state.resources, cost)} onClick={() => act({ type: "raiseOcak", id: o.id })}>
                          {lvl >= OCAK_MAX ? t("maxLevel") : t("raiseOcak")}
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-1 text-stone-400">
                        <Lock size={12} /> {t("fortLocked", { n: o.commanders[0].era + 1 })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      <HeroSquad state={state} act={act} />
    </div>
  );
}
