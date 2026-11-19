import { useState } from "react";
import { HERO_BY_ID, TRIBE_BY_ID } from "../data/oghuzData";
import { PATHS } from "../data/eras";
import { useI18n } from "../i18n";
import { HeroPortrait } from "./HeroPortrait";
import { LanguagePicker } from "./LanguagePicker";
import { TamgaFlag } from "./TamgaFlag";
import { Button, Card } from "./ui";

/** After choosing a tribe: choose the state whose history the tribe will live through. */
export function PathSelect({ tribeId, onChoose }: { tribeId: string; onChoose: (id: string) => void }) {
  const { t, tx } = useI18n();
  const tribe = TRIBE_BY_ID[tribeId];
  const sorted = [...PATHS].sort((a, b) => Number(b.tribes.includes(tribeId)) - Number(a.tribes.includes(tribeId)));
  const [picked, setPicked] = useState(sorted[0].id);
  const path = PATHS.find((p) => p.id === picked)!;
  return (
    <div className="mx-auto max-w-5xl p-4 pb-40 text-stone-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TamgaFlag tribe={tribe} size={40} />
          <b className="text-lg">{tribe.name}</b>
        </div>
        <LanguagePicker />
      </div>
      <h1 className="mt-3 text-center text-2xl font-extrabold text-kayi-gold">{t("choosePathTitle")}</h1>
      <p className="mb-4 text-center text-sm text-stone-400">{t("choosePathSub")}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {sorted.map((p) => {
          const historic = p.tribes.includes(tribeId);
          const rulers = p.eras.map((e) => e.ruler).filter((x): x is string => Boolean(x && HERO_BY_ID[x]));
          return (
            <button
              type="button"
              key={p.id}
              onClick={() => setPicked(p.id)}
              className={`rounded-xl border p-3 text-start ${picked === p.id ? "border-kayi-gold bg-kayi-blue/30" : "border-stone-700 bg-stone-900/80 hover:bg-stone-800"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <b className="text-base">{tx(p.name)}</b>
                <span className={`rounded px-1.5 py-0.5 text-[10px] ${historic ? "bg-steppe-green text-stone-950" : "bg-stone-700"}`}>
                  {historic ? t("historicPath") : t("alliedPath")}
                </span>
              </div>
              <div className="text-xs text-stone-400">
                {t("erasCount", { n: p.eras.length })} · {p.eras[0].years} – {p.eras[p.eras.length - 1].years}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {rulers.slice(0, 10).map((id) => (
                  <HeroPortrait key={id} hero={HERO_BY_ID[id]} size={34} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <Card className="fixed inset-x-2 bottom-2 mx-auto max-w-5xl border-kayi-gold shadow-2xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1 text-sm">
            <b>{tx(path.name)}</b>
            <div className="text-xs text-stone-400">
              {path.eras.map((e) => tx(e.title)).join(" → ")}
            </div>
          </div>
          <Button onClick={() => onChoose(path.id)}>{t("beginPath", { name: tx(path.name) })}</Button>
        </div>
      </Card>
    </div>
  );
}
