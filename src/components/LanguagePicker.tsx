import { LANGS, useI18n, type Lang } from "../i18n";

export function LanguagePicker() {
  const { lang, setLang, t } = useI18n();
  return (
    <label className="flex items-center gap-1 text-xs text-stone-400">
      <span className="sr-only sm:not-sr-only">{t("language")}</span>
      <select
        value={lang}
        onChange={(e: { target: { value: string } }) => setLang(e.target.value as Lang)}
        className="rounded-md border border-stone-700 bg-stone-900 px-2 py-1 text-sm text-stone-100"
        aria-label={t("language")}
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </label>
  );
}
