import { ScrollText } from "lucide-react";
import { useState } from "react";
import { TamgaFlag } from "../components/TamgaFlag";
import { Button, Card, Confidence, SectionTitle, buffText, fmt } from "../components/ui";
import { BEASTS, HEROES, SONS, SOURCES, STATES, TRIBES } from "../data/oghuzData";
import { playerStrength } from "../engine/combat";
import { TROOP_IDS } from "../engine/economy";
import { useI18n } from "../i18n";
import type { StringKey } from "../i18n/strings";
import type { Action } from "../state/useGame";
import type { GameState, Msg } from "../types/game";

export function CodexTab({ state, act }: { state: GameState; act: (a: Action) => void }) {
  const { t, tx } = useI18n();
  const [armed, setArmed] = useState(0);
  const power = TROOP_IDS.reduce((s, x) => s + playerStrength(state)[x], 0);
  const linked = (tribeId: string) => STATES.filter((s) => s.tribeLink === tribeId);
  const msg = (m: Msg) => {
    const v = { ...(m.v ?? {}) };
    if (typeof v.beastId === "string") {
      const beast = BEASTS.find((b) => b.id === v.beastId);
      v.name = beast ? tx(beast.name) : String(v.beastId);
    }
    return t(m.k as StringKey, v);
  };
  const confirming = Date.now() - armed < 4000;
  return (
    <div className="flex flex-col gap-3">
      <Card className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        <div>
          <div className="text-xs text-stone-400">{t("statsStates")}</div>
          <div className="text-2xl font-bold text-kayi-gold">
            {state.conquered.length}/{STATES.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-stone-400">{t("statsPower")}</div>
          <div className="text-2xl font-bold">{fmt(power)}</div>
        </div>
        <div>
          <div className="text-xs text-stone-400">{t("statsWaves")}</div>
          <div className="text-2xl font-bold">{state.defenseWave - 1}</div>
        </div>
        <div>
          <div className="text-xs text-stone-400">{t("statsHeroes")}</div>
          <div className="text-2xl font-bold">
            {Object.keys(state.heroes).length}/{HEROES.length}
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle title={t("codexTitle")} sub={t("codexSub")} />
        <div className="mb-2 flex flex-wrap gap-2 text-[10px]">
          <span className="flex items-center gap-1"><Confidence level="verified" /> {t("confVerified")}</span>
          <span className="flex items-center gap-1"><Confidence level="reported" /> {t("confReported")}</span>
          <span className="flex items-center gap-1"><Confidence level="contested" /> {t("confContested")}</span>
        </div>
        {(["Bozok", "Üçok"] as const).map((wing) => (
          <div key={wing} className="mb-3">
            <h3 className="font-bold text-kayi-gold">
              {wing} — {t(wing === "Bozok" ? "rightWing" : "leftWing")}
            </h3>
            {SONS.filter((s) => s.wing === wing).map((son) => (
              <div key={son.id} className="mb-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <b>{son.name}</b>
                  <span className="text-stone-400">
                    ({tx(son.meaning)}) · {t("ongon")}: {tx(son.ongon)}
                  </span>
                  <Confidence level={son.ongonConfidence} />
                </div>
                <div className="mt-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {TRIBES.filter((x) => x.son === son.id).map((x) => {
                    const states = linked(x.id);
                    return (
                      <div key={x.id} className={`flex gap-2 rounded-lg border p-2 text-xs ${state.tribe === x.id ? "border-kayi-gold" : "border-stone-700"} bg-stone-950/60`}>
                        <TamgaFlag tribe={x} size={40} conquered={states.some((s) => state.conquered.includes(s.id))} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold">
                            {x.order}. {x.name}
                          </div>
                          <div className="text-stone-300">
                            “{tx(x.meaning)}” <Confidence level={x.meaningConfidence} />
                          </div>
                          <div className="text-stone-400">
                            {tx(x.legacy)} <Confidence level={x.legacyConfidence} />
                          </div>
                          <div className="text-steppe-green">{buffText(x.buffs as Record<string, number>, tx)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </Card>

      <Card>
        <SectionTitle title={t("chronicle")} sub={t("chronicleSub")} />
        {state.log.length === 0 && <p className="text-sm text-stone-400">{t("nothingYet")}</p>}
        {state.log.map((r) => (
          <div key={`${r.at}-${r.title.k}`} className="mb-1 border-b border-stone-800 pb-1 text-xs">
            <div className={`flex items-center gap-1 font-semibold ${r.win ? "text-green-300" : "text-red-300"}`}>
              <ScrollText size={12} /> {msg(r.title)}
              <span className="ms-auto font-normal text-stone-500">{new Date(r.at).toLocaleTimeString()}</span>
            </div>
            {r.lines.map((l, i) => (
              <div key={i} className="text-stone-400">
                {msg(l)}
              </div>
            ))}
          </div>
        ))}
      </Card>

      <Card>
        <SectionTitle title={t("sourcesTitle")} />
        <ul className="list-disc ps-5 text-xs text-stone-400">
          {SOURCES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Card>

      <div className="text-end">
        <Button
          tone={confirming ? "red" : "ghost"}
          small
          onClick={() => {
            const now = Date.now();
            if (now - armed < 4000) {
              setArmed(0);
              act({ type: "reset", now });
            } else {
              setArmed(now);
            }
          }}
        >
          {confirming ? t("confirmReset") : t("newGame")}
        </Button>
      </div>
    </div>
  );
}
