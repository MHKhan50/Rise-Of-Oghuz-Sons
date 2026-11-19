import { Castle, Flag, Swords, Target, Tent } from "lucide-react";
import { useState, type ReactNode } from "react";
import { LanguagePicker } from "./components/LanguagePicker";
import { ResourceBar } from "./components/ResourceBar";
import { TamgaFlag } from "./components/TamgaFlag";
import { TribeSelect } from "./components/TribeSelect";
import { PathSelect } from "./components/PathSelect";
import { currentEra, currentPath } from "./engine/economy";
import { SON_BY_ID, TRIBE_BY_ID } from "./data/oghuzData";
import { I18nProvider, useI18n } from "./i18n";
import type { StringKey } from "./i18n/strings";
import { useGame } from "./state/useGame";
import { CodexTab } from "./tabs/CodexTab";
import { ConquestTab } from "./tabs/ConquestTab";
import { DefenseTab } from "./tabs/DefenseTab";
import { HuntTab } from "./tabs/HuntTab";
import { ObaTab } from "./tabs/ObaTab";

type TabId = "oba" | "av" | "fetih" | "kale" | "bayrak";

const TABS: { id: TabId; key: StringKey; icon: ReactNode }[] = [
  { id: "oba", key: "tabOba", icon: <Tent size={18} /> },
  { id: "av", key: "tabHunt", icon: <Target size={18} /> },
  { id: "fetih", key: "tabConquest", icon: <Swords size={18} /> },
  { id: "kale", key: "tabSiege", icon: <Castle size={18} /> },
  { id: "bayrak", key: "tabCodex", icon: <Flag size={18} /> },
];

function Game() {
  const { t, tx } = useI18n();
  const { state, act } = useGame();
  const [tab, setTab] = useState<TabId>("oba");
  const now = state.lastTick;

  if (!state.tribe) {
    return (
      <div className="min-h-full bg-stone-950">
        <TribeSelect onChoose={(id) => act({ type: "chooseTribe", tribe: id })} />
      </div>
    );
  }

  if (!state.path) {
    return (
      <div className="min-h-full bg-stone-950">
        <PathSelect tribeId={state.tribe} onChoose={(id) => act({ type: "choosePath", path: id })} />
      </div>
    );
  }

  const tribe = TRIBE_BY_ID[state.tribe];
  const path = currentPath(state);
  const era = currentEra(state);
  return (
    <div className="min-h-full bg-stone-950 pb-20 text-stone-100 sm:pb-4">
      <header className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950/95 px-3 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <TamgaFlag tribe={tribe} size={28} />
          <div className="me-auto leading-tight">
            <div className="font-extrabold text-kayi-gold">{t("title")}</div>
            <div className="text-xs text-stone-400">
              {tribe.name} · {SON_BY_ID[tribe.son].name} ({tx(SON_BY_ID[tribe.son].meaning)}) · {tribe.wing}
              {path && era && (
                <span className="block text-kayi-gold/80">
                  {tx(path.name)} · {t("eraOf", { n: state.era + 1, total: path.eras.length })} · {tx(era.title)}
                </span>
              )}
            </div>
          </div>
          <nav className="hidden gap-1 md:flex">
            {TABS.map((x) => (
              <button
                type="button"
                key={x.id}
                onClick={() => setTab(x.id)}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${tab === x.id ? "bg-kayi-blue text-white" : "text-stone-300 hover:bg-stone-800"}`}
              >
                {x.icon} {t(x.key)}
              </button>
            ))}
          </nav>
          <LanguagePicker />
        </div>
        <div className="mx-auto mt-2 max-w-6xl">
          <ResourceBar state={state} now={now} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-3">
        {tab === "oba" && <ObaTab state={state} act={act} now={now} />}
        {tab === "av" && <HuntTab state={state} act={act} now={now} />}
        {tab === "fetih" && <ConquestTab state={state} act={act} />}
        {tab === "kale" && <DefenseTab state={state} act={act} />}
        {tab === "bayrak" && <CodexTab state={state} act={act} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-stone-800 bg-stone-950 md:hidden">
        {TABS.map((x) => (
          <button
            type="button"
            key={x.id}
            onClick={() => setTab(x.id)}
            className={`flex flex-col items-center py-2 text-[11px] ${tab === x.id ? "text-kayi-gold" : "text-stone-400"}`}
          >
            {x.icon}
            {t(x.key)}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Game />
    </I18nProvider>
  );
}
