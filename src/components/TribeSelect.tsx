import { useState } from "react";
import { SONS, TRIBES } from "../data/oghuzData";
import { useI18n } from "../i18n";
import { LanguagePicker } from "./LanguagePicker";
import { TamgaFlag } from "./TamgaFlag";
import { Button, Card, Confidence, buffText } from "./ui";

export function TribeSelect({ onChoose }: { onChoose: (id: string) => void }) {
  const { t, tx } = useI18n();
  const [picked, setPicked] = useState<string | null>(null);
  const tribe = TRIBES.find((x) => x.id === picked);
  return (
    <div className="mx-auto max-w-5xl p-4 text-stone-100">
      <div className="flex justify-end">
        <LanguagePicker />
      </div>
      <p className="mt-2 text-center font-serif text-lg text-kayi-gold" dir="rtl" lang="ar">
        بسم الله الرحمن الرحيم
      </p>
      <p className="text-center text-xs text-stone-500">{t("bismillah")}</p>
      <h1 className="mt-2 text-center text-3xl font-extrabold text-kayi-gold">{t("title")}</h1>
      <p className="mb-4 text-center text-sm text-stone-400">{t("tagline")}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {(["Bozok", "Üçok"] as const).map((wing) => (
          <Card key={wing}>
            <h2 className="font-bold text-kayi-gold">
              {wing} · {t(wing === "Bozok" ? "rightWing" : "leftWing")}
            </h2>
            <p className="mb-2 text-xs text-stone-400">{t(wing === "Bozok" ? "bozokText" : "ucokText")}</p>
            {SONS.filter((s) => s.wing === wing).map((son) => (
              <div key={son.id} className="mb-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold">{son.name}</span>
                  <span className="text-stone-400">
                    ({tx(son.meaning)}) · {t("ongon")}: {tx(son.ongon)}
                  </span>
                  <Confidence level={son.ongonConfidence} />
                </div>
                <div className="mt-1 grid grid-cols-4 gap-1">
                  {TRIBES.filter((x) => x.son === son.id).map((x) => (
                    <button
                      type="button"
                      key={x.id}
                      onClick={() => setPicked(x.id)}
                      className={`flex flex-col items-center rounded-lg p-1 text-xs ${picked === x.id ? "bg-kayi-blue" : "bg-stone-800 hover:bg-stone-700"}`}
                    >
                      <TamgaFlag tribe={x} size={34} />
                      {x.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>
      {tribe && (
        <div className="sticky bottom-2 mt-3 flex flex-col gap-2 rounded-xl border border-kayi-gold bg-stone-900 p-3 shadow-2xl sm:flex-row sm:items-center">
          <TamgaFlag tribe={tribe} size={52} />
          <div className="flex-1 text-sm">
            <div className="text-lg font-bold">{tribe.name}</div>
            <div className="flex flex-wrap items-center gap-1 text-stone-300">
              “{tx(tribe.meaning)}” <Confidence level={tribe.meaningConfidence} />
            </div>
            <div className="flex flex-wrap items-center gap-1 text-stone-400">
              {tx(tribe.legacy)} <Confidence level={tribe.legacyConfidence} />
            </div>
            <div className="text-steppe-green">
              {tx(tribe.specialty)}: {buffText(tribe.buffs as Record<string, number>, tx)}
            </div>
          </div>
          <Button onClick={() => onChoose(tribe.id)}>{t("lead", { name: tribe.name })}</Button>
        </div>
      )}
    </div>
  );
}
