import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AR, FA, GAG, KK, UZ } from "./locales";
import { LANGS, STRINGS, type Lang, type StringKey } from "./strings";

/** Text in several languages; English is required, the rest are optional. */
export type L = { en: string } & Partial<Record<Lang, string>>;

const EXTRA: Partial<Record<Lang, Partial<Record<StringKey, string>>>> = { ar: AR, fa: FA, gag: GAG, uz: UZ, kk: KK };

/** Where to look when a language has no entry: Oghuz and other Turkic languages fall back to Türkçe. */
const FALLBACK: Record<Lang, Lang[]> = {
  en: [], ur: ["en"], tr: ["en"], az: ["tr", "en"], tk: ["tr", "en"], gag: ["tr", "en"],
  uz: ["tr", "en"], kk: ["tr", "en"], ar: ["en"], fa: ["en"],
};

function lookup(lang: Lang, key: StringKey): string {
  for (const l of [lang, ...FALLBACK[lang]]) {
    const extra = EXTRA[l]?.[key];
    if (extra) return extra;
    const base = (STRINGS[key] as Partial<Record<Lang, string>>)[l];
    if (base) return base;
  }
  return STRINGS[key].en;
}

export function pickText(lang: Lang, text: L): string {
  for (const l of [lang, ...FALLBACK[lang]]) if (text[l]) return text[l]!;
  return text.en;
}

function fill(s: string, vars?: Record<string, string | number>): string {
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s;
}

interface I18n {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
  tx: (text: L, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18n | null>(null);
const KEY = "rise-of-oghuz-sons-lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY) as Lang | null;
    if (saved && LANGS.some((l) => l.code === saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  const nav = (typeof navigator !== "undefined" ? navigator.language : "en").toLowerCase();
  const match = LANGS.find((l) => nav.startsWith(l.code));
  return match ? match.code : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const dir = LANGS.find((l) => l.code === lang)?.dir ?? "ltr";
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang, dir]);
  const value = useMemo<I18n>(
    () => ({
      lang,
      dir,
      setLang: setLangState,
      t: (key, vars) => fill(lookup(lang, key), vars),
      tx: (text, vars) => fill(pickText(lang, text), vars),
    }),
    [lang, dir],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}

export { LANGS };
export type { Lang };
