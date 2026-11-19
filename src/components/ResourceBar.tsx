import { RESOURCE_INFO } from "../data/oghuzData";
import { RESOURCE_IDS, armyCap, armySize, productionPerSecond, storageCap } from "../engine/economy";
import { useI18n } from "../i18n";
import type { GameState } from "../types/game";
import { fmt } from "./ui";

export function ResourceBar({ state, now }: { state: GameState; now: number }) {
  const { t, tx } = useI18n();
  const prod = productionPerSecond(state, now);
  const cap = storageCap(state);
  return (
    <div className="grid grid-cols-4 gap-1 sm:grid-cols-7">
      {RESOURCE_IDS.map((r) => {
        const info = RESOURCE_INFO[r];
        const full = r !== "celik" && state.resources[r] >= cap;
        return (
          <div key={r} className="rounded-md bg-stone-900 px-2 py-1" title={`${info.name} · ${tx(info.label)}`}>
            <div className="flex items-center gap-1 truncate text-[10px] uppercase tracking-wide text-stone-400">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: info.color }} />
              {tx(info.label)}
            </div>
            <div className={`text-sm font-bold ${full ? "text-red-300" : "text-stone-100"}`}>
              {fmt(state.resources[r])}
              <span className="ms-1 text-[10px] font-normal text-stone-400">+{prod[r].toFixed(1)}/s</span>
            </div>
          </div>
        );
      })}
      <div className="rounded-md bg-stone-900 px-2 py-1">
        <div className="truncate text-[10px] uppercase tracking-wide text-stone-400">{t("army")}</div>
        <div className="text-sm font-bold text-stone-100">
          {fmt(armySize(state))}/{fmt(armyCap(state))}
          <span className="ms-1 text-[10px] font-normal text-stone-400">
            {t("storage")} {fmt(cap)}
          </span>
        </div>
      </div>
    </div>
  );
}
